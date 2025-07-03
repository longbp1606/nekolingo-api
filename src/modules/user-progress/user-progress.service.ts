import { Injectable, NotFoundException } from "@nestjs/common";
import {
	ExerciseModel,
	LessonModel,
	UserExerciseProgressModel,
	UserLessonProgressModel,
	UserModel,
} from "@db/models";
import { CompleteLessonRequest } from "./dto/complete-lesson.request";
import { SubmitExerciseDto } from "./dto/submit-exercise.dto";
import { CompleteFullLessonDto } from "./dto/complete-full-lesson.dto";
import { Types } from "mongoose";

@Injectable()
export class UserProgressService {
	async completeLesson(dto: CompleteLessonRequest) {
		const userId = new Types.ObjectId(dto.user_id);
		const lessonId = new Types.ObjectId(dto.lesson_id);

		const lesson = await LessonModel.findById(lessonId);
		if (!lesson) throw new NotFoundException("Lesson not found");

		const xp = lesson.xp_reward || 10;

		await UserLessonProgressModel.updateOne(
			{ user_id: userId, lesson_id: lessonId },
			{
				$set: {
					completed_at: new Date(),
					xp_earned: xp,
				},
			},
			{ upsert: true },
		);

		await UserModel.findByIdAndUpdate(userId, {
			$inc: {
				xp: xp,
				weekly_xp: xp,
			},
		});

		if (lesson.mode === "heart_recovery") {
			await UserModel.findByIdAndUpdate(userId, {
				$inc: { hearts: 1 },
			});
		}

		return this.updateStreak(userId);
	}

	async completeFullLesson(dto: CompleteFullLessonDto) {
		const userId = new Types.ObjectId(dto.user_id);
		const lessonId = new Types.ObjectId(dto.lesson_id);

		for (const ex of dto.exercises) {
			const exerciseId = new Types.ObjectId(ex.exercise_id);
			const exercise = await ExerciseModel.findById(exerciseId);
			if (!exercise) continue;

			const isCorrect = this.checkAnswerCorrect(
				exercise.correct_answer,
				ex.user_answer,
			);

			await UserExerciseProgressModel.findOneAndUpdate(
				{ user_id: userId, exercise_id: exerciseId },
				{
					completed_at: new Date(),
					is_mistake: !isCorrect,
					user_answer: ex.user_answer,
					answer_time: ex.answer_time,
					score: isCorrect ? 1 : 0,
				},
				{ upsert: true },
			);
		}

		return this.completeLesson({
			user_id: dto.user_id,
			lesson_id: dto.lesson_id,
		});
	}

	async updateStreak(userId: Types.ObjectId) {
		const user = await UserModel.findById(userId);
		if (!user) throw new NotFoundException("User not found");

		const now = new Date();
		const lastActive = user.last_active_date || user.createdAt || now;
		const daysDiff = Math.floor((+now - +lastActive) / (1000 * 60 * 60 * 24));

		if (daysDiff === 1) {
			user.is_freeze = true;
			user.freeze_count = 2;
		} else if (daysDiff === 2) {
			user.is_freeze = true;
			user.freeze_count = 1;
		} else if (daysDiff >= 3) {
			user.streak_days = 1;
			user.is_freeze = false;
			user.freeze_count = 0;
		}

		if (daysDiff <= 1) {
			user.streak_days += 1;
			user.is_freeze = false;
			user.freeze_count = 0;
		}

		user.last_active_date = now;
		await user.save();

		return {
			streak_days: user.streak_days,
			is_freeze: user.is_freeze,
			freeze_count: user.freeze_count,
		};
	}

	async getHeartRecoveryLesson(userId: Types.ObjectId) {
		const completedLessonIds = await UserLessonProgressModel.find({
			user_id: userId,
		}).distinct("lesson_id");

		let lessons = await LessonModel.find({
			_id: { $in: completedLessonIds },
			mode: "heart_recovery",
		});

		if (lessons.length === 0) {
			lessons = await LessonModel.find({
				_id: { $in: completedLessonIds },
				type: { $in: ["vocabulary"] },
			});
		}

		if (lessons.length === 0) {
			throw new NotFoundException(
				"No suitable lessons found for heart recovery",
			);
		}

		const randomIndex = Math.floor(Math.random() * lessons.length);
		return lessons[randomIndex];
	}

	async getLessonExercisesByMode(
		userId: Types.ObjectId,
		lessonId: Types.ObjectId,
	) {
		const lesson = await LessonModel.findById(lessonId);
		if (!lesson) throw new NotFoundException("Lesson not found");

		let exercises;

		switch (lesson.mode) {
			case "normal":
				exercises = await ExerciseModel.find({ lesson: lesson._id });
				break;

			case "personalized": {
				const mistakeExercises = await UserExerciseProgressModel.find({
					user_id: userId,
					is_mistake: true,
				}).distinct("exercise_id");

				exercises = await ExerciseModel.find({
					_id: { $in: mistakeExercises },
				});
				break;
			}

			case "mixed": {
				const userLessons = await UserLessonProgressModel.find({
					user_id: userId,
				}).distinct("lesson_id");

				exercises = await ExerciseModel.aggregate([
					{ $match: { lesson: { $in: userLessons } } },
					{ $sample: { size: 10 } },
				]);
				break;
			}

			case "heart_recovery":
				exercises = await ExerciseModel.find({ lesson: lesson._id });
				break;

			default:
				throw new NotFoundException("Unsupported lesson mode");
		}

		return {
			mode: lesson.mode,
			exercises,
		};
	}

	async submitExercise(dto: SubmitExerciseDto) {
		const userId = new Types.ObjectId(dto.user_id);
		const exerciseId = new Types.ObjectId(dto.exercise_id);

		const exercise = await ExerciseModel.findById(exerciseId);
		if (!exercise) throw new NotFoundException("Exercise not found");

		const isCorrect = this.checkAnswerCorrect(
			exercise.correct_answer,
			dto.user_answer,
		);

		await UserExerciseProgressModel.findOneAndUpdate(
			{ user_id: userId, exercise_id: exerciseId },
			{
				completed_at: new Date(),
				is_mistake: !isCorrect,
				user_answer: dto.user_answer,
				answer_time: dto.answer_time,
				score: isCorrect ? 1 : 0,
			},
			{ upsert: true },
		);

		return {
			correct: isCorrect,
			is_mistake: !isCorrect,
		};
	}

	private checkAnswerCorrect(correct: any, userAnswer: any): boolean {
		if (Array.isArray(correct)) {
			return (
				Array.isArray(userAnswer) &&
				correct.length === userAnswer.length &&
				correct.every((val, idx) => val === userAnswer[idx])
			);
		}
		if (typeof correct === "object") {
			return JSON.stringify(correct) === JSON.stringify(userAnswer);
		}
		return correct === userAnswer;
	}
}
