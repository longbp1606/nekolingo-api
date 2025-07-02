import { Injectable, NotFoundException } from "@nestjs/common";
import { UserLessonProgressModel, LessonModel, UserModel } from "@db/models";
import { Types } from "mongoose";
import { CompleteLessonRequest } from "./dto/complete-lesson.request";

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
		if (lesson.type.includes("heart_recovery")) {
			await UserModel.findByIdAndUpdate(userId, {
				$inc: { hearts: 1 },
			});
		}

		return this.updateStreak(userId);
	}

	async updateStreak(userId: Types.ObjectId) {
		const user = await UserModel.findById(userId);
		if (!user) throw new NotFoundException("User not found");

		const now = new Date();
		const lastActive = user.last_active_date || user.createdAt || now;
		const daysDiff = Math.floor((+now - +lastActive) / (1000 * 60 * 60 * 24));

		if (daysDiff === 0) {
		} else if (daysDiff === 1) {
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
			type: { $in: ["heart_recovery"] },
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
		const lesson = lessons[randomIndex];

		return lesson;
	}
}
