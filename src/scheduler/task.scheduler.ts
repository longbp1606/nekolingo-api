import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { QuestService } from "@modules/quest/quest.service";
import { LeaderboardService } from "@modules/leaderboard/leaderboard.service";
import { UserStreakService } from "@modules/user-streak/user-streak.service";
import { UserModel } from "@db/models";
import { PersonalizedLessonService } from "@modules/ai/personalized-lesson.service";

@Injectable()
export class TaskScheduler {
	constructor(
		private readonly questService: QuestService,
		private readonly leaderboardService: LeaderboardService,
		private readonly userStreakService: UserStreakService,
		private readonly personalizedLessonService: PersonalizedLessonService,
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
		const users = await UserModel.find({}, "_id");

		const results = await Promise.allSettled(
			users.map((user) => this.userStreakService.updateStreak(user._id, false)),
		);

		const success = results.filter((r) => r.status === "fulfilled").length;
		const failed = results.filter((r) => r.status === "rejected").length;
		console.log(`[Streak] Updated: ${success}, Failed: ${failed}`);
	}
	@Cron("0 * * * *") // Mỗi giờ
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
		console.log(`[PersonalizedLesson] Created for ${success} users this hour`);
	}
}
