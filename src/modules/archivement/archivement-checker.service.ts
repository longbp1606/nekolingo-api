import { Injectable } from "@nestjs/common";
import {
	ArchivementModel,
	UserArchivementModel,
	UserModel,
	UserLessonProgressModel,
	UserCourseProgressModel,
	UserExerciseProgressModel,
} from "@db/models";
import { Types } from "mongoose";
import { isSunday } from "date-fns";

@Injectable()
export class ArchivementCheckerService {
	async checkAndUnlockArchivements(userId: Types.ObjectId) {
		const user = await UserModel.findById(userId);
		if (!user) return;

		const unlocked = await UserArchivementModel.find({
			user_id: userId,
		}).distinct("archivement_id");

		const archivements = await ArchivementModel.find();

		const unlockedSet = new Set(unlocked.map((id) => id.toString()));

		for (const arch of archivements) {
			if (unlockedSet.has(arch._id.toString())) continue;

			const cond = arch.condition as any;
			let unlock = false;

			switch (cond.type) {
				case "streak_days":
					unlock = user.streak_days >= cond.value;
					break;

				case "total_xp":
					unlock = user.xp >= cond.value;
					break;

				case "freeze_count":
					unlock = user.freeze_count >= cond.value;
					break;

				case "current_level":
					unlock = user.current_level >= cond.value;
					break;

				case "weekly_xp":
					unlock = user.weekly_xp >= cond.value;
					break;

				case "first_mistake": {
					const hasMistake = await UserExerciseProgressModel.exists({
						user_id: userId,
						is_mistake: true,
					});
					unlock = !!hasMistake;
					break;
				}

				case "first_practice": {
					const practiced = await UserLessonProgressModel.exists({
						user_id: userId,
					});
					unlock = !!practiced;
					break;
				}

				case "complete_lessons": {
					const completed = await UserLessonProgressModel.countDocuments({
						user_id: userId,
						completed_at: { $ne: null },
					});
					unlock = completed >= cond.value;
					break;
				}

				case "complete_courses": {
					const completed = await UserCourseProgressModel.countDocuments({
						user_id: userId,
						completed_at: { $ne: null },
					});
					unlock = completed >= cond.value;
					break;
				}

				case "no_mistake_lesson": {
					const perfect = await UserLessonProgressModel.countDocuments({
						user_id: userId,
						score: 100,
					});
					unlock = perfect >= cond.value;
					break;
				}

				case "streak_on_sunday": {
					if (
						user.last_active_date &&
						isSunday(user.last_active_date) &&
						user.streak_days > 0
					) {
						unlock = true;
					}
					break;
				}

				case "practice_evening": {
					const now = new Date();
					const hour = now.getHours();
					if (hour >= 20 && hour < 22) {
						const practiced = await UserLessonProgressModel.exists({
							user_id: userId,
							completed_at: {
								$gte: new Date(
									now.getFullYear(),
									now.getMonth(),
									now.getDate(),
									20,
								),
								$lte: new Date(
									now.getFullYear(),
									now.getMonth(),
									now.getDate(),
									22,
								),
							},
						});
						unlock = !!practiced;
					}
					break;
				}

				case "login_streak_7_days":
					unlock = user.streak_days >= 7;
					break;
			}

			if (unlock) {
				await UserArchivementModel.create({
					user_id: userId,
					archivement_id: arch._id,
					unlock_at: new Date(),
				});
			}
		}
	}
}
