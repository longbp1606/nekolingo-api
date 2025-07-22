import { Injectable, NotFoundException } from "@nestjs/common";
import {
	ExerciseModel,
	LessonModel,
	TopicModel,
	UserExerciseProgressModel,
	UserLessonProgressModel,
	UserModel,
	UserTopicProgressModel,
	UserCourseProgressModel,
} from "@db/models";
import { CompleteLessonRequest } from "./dto/complete-lesson.request";
import { SubmitExerciseDto } from "./dto/submit-exercise.dto";
import { CompleteFullLessonDto } from "./dto/complete-full-lesson.dto";
import { Types } from "mongoose";
import { UserStreakService } from "@modules/user-streak/user-streak.service";
import { QuestService } from "@modules/quest/quest.service";
import { ExplainService } from "@modules/exercise/explain.service";

@Injectable()
export class UserProgressService {
	constructor(
		private readonly userStreakService: UserStreakService,
		private readonly questService: QuestService,
		private readonly explainService: ExplainService,
	) {}

	async completeLesson(dto: CompleteLessonRequest) {
		const userId = new Types.ObjectId(dto.user_id);
		const lessonId = new Types.ObjectId(dto.lesson_id);

		const lesson = await LessonModel.findById(lessonId).populate({
			path: "topic",
			populate: {
				path: "course",
				model: "Course",
			},
		});
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

		const topic = lesson.topic as any;
		const courseId = topic?.course?._id || topic?.course;
		const topicId = topic?._id || lesson.topic;

		const lessons = await LessonModel.find({ topic: topicId });
		const nextLesson = lessons.find((l) => l.order > lesson.order);

		await UserModel.findByIdAndUpdate(userId, {
			$inc: {
				xp: xp,
				weekly_xp: xp,
			},
			$set: {
				current_lesson: nextLesson?._id,
				current_topic: topicId,
				current_course: courseId,
			},
		});

		if (lesson.mode === "heart_recovery") {
			await UserModel.findByIdAndUpdate(userId, {
				$inc: { hearts: 1 },
			});
		}

		if (topicId) {
			const totalLessons = await LessonModel.countDocuments({ topic: topicId });
			const completedLessons = await UserLessonProgressModel.countDocuments({
				user_id: userId,
				lesson_id: {
					$in: await LessonModel.find({ topic: topicId }).distinct("_id"),
				},
				completed_at: { $ne: null },
			});

			if (totalLessons > 0 && completedLessons === totalLessons) {
				await UserTopicProgressModel.updateOne(
					{ user_id: userId, topic_id: topicId },
					{
						$set: {
							proficiency_level: 100,
							last_practiced_at: new Date(),
						},
					},
					{ upsert: true },
				);
			}
		}

		if (courseId) {
			const topicIdsInCourse = await TopicModel.find({
				course: courseId,
			}).distinct("_id");

			const completedTopicCount = await UserTopicProgressModel.countDocuments({
				user_id: userId,
				topic_id: { $in: topicIdsInCourse },
				proficiency_level: { $gte: 100 },
			});

			if (
				topicIdsInCourse.length > 0 &&
				completedTopicCount === topicIdsInCourse.length
			) {
				await UserCourseProgressModel.updateOne(
					{ user_id: userId, course_id: courseId },
					{
						$set: { completed_at: new Date() },
						$setOnInsert: { start_date: new Date() },
					},
					{ upsert: true },
				);
			} else {
				await UserCourseProgressModel.updateOne(
					{ user_id: userId, course_id: courseId },
					{ $setOnInsert: { start_date: new Date() } },
					{ upsert: true },
				);
			}
		}

		await this.questService.checkAndCompleteDailyQuests(userId);

		return this.userStreakService.updateStreak(userId);
	}

	async completeFullLesson(dto: CompleteFullLessonDto) {
		const userId = new Types.ObjectId(dto.user_id);
		const lessonId = new Types.ObjectId(dto.lesson_id);

		const lesson = await LessonModel.findById(lessonId);
		if (!lesson) throw new NotFoundException("Lesson not found");

		for (const ex of dto.exercises) {
			const exerciseId = new Types.ObjectId(ex.exercise_id);
			const exercise = await ExerciseModel.findById(exerciseId);
			if (!exercise) continue;

			const isCorrect = this.checkAnswerCorrect(
				exercise.correct_answer,
				ex.user_answer,
			);

			if (!isCorrect) {
				await UserModel.findByIdAndUpdate(userId, {
					$inc: { hearts: -1 },
				});
			}

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
				answer_time: dto.answer_time ?? 0,
				score: isCorrect ? 1 : 0,
			},
			{ upsert: true },
		);

		await this.questService.checkAndCompleteDailyQuests(userId);

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
	async explainAnswer(userId: string, exerciseId: string) {
		return this.explainService.explainAnswer(userId, exerciseId);
	}
}
