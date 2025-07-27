import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { QuestService } from "@modules/quest/quest.service";
import { LeaderboardService } from "@modules/leaderboard/leaderboard.service";
import { UserStreakService } from "@modules/user-streak/user-streak.service";
import { UserModel } from "@db/models";
import { PersonalizedLessonService } from "@modules/ai/personalized-lesson.service";
import { ArchivementCheckerService } from "@modules/archivement/archivement-checker.service";

@Injectable()
export class TaskScheduler {
	constructor(
		private readonly questService: QuestService,
		private readonly leaderboardService: LeaderboardService,
		private readonly userStreakService: UserStreakService,
		private readonly personalizedLessonService: PersonalizedLessonService,
		private readonly archivementCheckerService: ArchivementCheckerService,
	) {}

	@Cron("0 0 * * *") // mỗi ngày lúc 00:00
	async generateDailyQuest() {
		const users = await UserModel.find({}, "_id");

		const results = await Promise.allSettled(
			users.map((user) =>
				this.questService.generateDailyQuestsForUser(user._id.toString()),
			),
		);

		const success = results.filter((r) => r.status === "fulfilled").length;
		const failed = results.filter((r) => r.status === "rejected").length;
		console.log(`[DailyQuest] Success: ${success}, Failed: ${failed}`);
	}

	@Cron("0 0 * * 1") // mỗi thứ 2 đầu tuần
	async generateWeeklyLeaderboard() {
		await this.leaderboardService.createWeeklyLeaderboard();
		await UserModel.updateMany({}, { $set: { weekly_xp: 0 } });
		console.log("[Leaderboard] Weekly leaderboard created and XP reset");
	}

	@Cron("5 0 * * *") // mỗi ngày lúc 00:05
	async updateUserStreaks() {
		const users = await UserModel.find(
			{},
			"_id streak_days last_active_date backup_streak_days",
		);

		const results = await Promise.allSettled(
			users.map(async (user) => {
				const before = user.streak_days;
				const result = await this.userStreakService.updateStreak(
					user._id,
					false,
				);

				if (before > 0 && result.streak_days === 0) {
					await UserModel.findByIdAndUpdate(user._id, {
						$set: { backup_streak_days: before },
					});
				} else if (
					result.streak_days === 0 &&
					user.backup_streak_days > 0 &&
					user.last_active_date
				) {
					const now = new Date();
					const daysSinceLastActive = Math.floor(
						(now.getTime() - new Date(user.last_active_date).getTime()) /
							(1000 * 60 * 60 * 24),
					);

					if (daysSinceLastActive >= 2) {
						await UserModel.findByIdAndUpdate(user._id, {
							$set: { backup_streak_days: 0 },
						});
					}
				}

				return result;
			}),
		);

		const success = results.filter((r) => r.status === "fulfilled").length;
		const failed = results.filter((r) => r.status === "rejected").length;
		console.log(`[Streak] Updated: ${success}, Failed: ${failed}`);
	}

	@Cron("*/5 * * * *") // Mỗi 5 phút
	async autoGeneratePersonalizedLessons() {
		const users = await UserModel.find({}, "_id");

		const results = await Promise.allSettled(
			users.map((user) =>
				this.personalizedLessonService.autoGenerateIfNeeded(
					user._id.toString(),
				),
			),
		);

		const success = results.filter((r) => r.status === "fulfilled").length;
		console.log(`[PersonalizedLesson] Created for ${success} users this run`);
	}

	@Cron("10 0 * * *") // Mỗi ngày lúc 00:10
	async checkDoubleOrNothingResults() {
		const users = await UserModel.find({
			"double_or_nothing.is_active": true,
		});

		const now = new Date();

		let successCount = 0;
		let failedCount = 0;

		for (const user of users) {
			const challenge = user.double_or_nothing;
			if (!challenge || !challenge.start_date) continue;

			const daysPassed =
				(now.getTime() - new Date(challenge.start_date).getTime()) /
				(1000 * 60 * 60 * 24);

			if (daysPassed >= 7) {
				const isSuccessful = user.streak_days >= 7;

				if (isSuccessful) {
					user.balance += 100;
					challenge.is_completed = true;
					successCount++;
				} else {
					failedCount++;
				}

				challenge.is_active = false;
				await user.save();
			}
		}

		console.log(
			`[DoubleOrNothing] Kết thúc: +${successCount} thành công, -${failedCount} thất bại`,
		);
	}

	@Cron("15 0 * * *") // Mỗi ngày lúc 00:15
	async checkArchivementUnlocks() {
		const users = await UserModel.find({}, "_id");

		const results = await Promise.allSettled(
			users.map((user) =>
				this.archivementCheckerService.checkAndUnlockArchivements(user._id),
			),
		);

		const success = results.filter((r) => r.status === "fulfilled").length;
		const failed = results.filter((r) => r.status === "rejected").length;

		console.log(`[Archivement] Checked: ${success} users, Failed: ${failed}`);
	}
}
