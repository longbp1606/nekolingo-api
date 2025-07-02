import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { QuestService } from "@modules/quest/quest.service";
import { LeaderboardService } from "@modules/leaderboard/leaderboard.service";
import { UserModel } from "@db/models";

@Injectable()
export class TaskScheduler {
	constructor(
		private readonly questService: QuestService,
		private readonly leaderboardService: LeaderboardService,
	) {}

	@Cron("0 0 * * *") // mỗi ngày lúc 00:00
	async generateDailyQuest() {
		const users = await UserModel.find({}, "_id");
		for (const user of users) {
			await this.questService.generateDailyQuestsForUser(user._id.toString());
		}
	}

	@Cron("0 0 * * 1") // mỗi thứ 2 đầu tuần
	async generateWeeklyLeaderboard() {
		await this.leaderboardService.createWeeklyLeaderboard();
		await UserModel.updateMany({}, { $set: { weekly_xp: 0 } }); // reset
	}
}
