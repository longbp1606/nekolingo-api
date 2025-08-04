import { Injectable } from "@nestjs/common";
import { LeaderboardModel, UserModel } from "@db/models";

@Injectable()
export class LeaderboardService {
	async getOverallLeaderboard(limit = 30) {
		return UserModel.find({ role: { $nin: [1, 2] } }, "username avatar_url xp")
			.sort({ xp: -1 })
			.limit(limit);
	}

	async getWeeklyLeaderboard(limit = 30) {
		const currentWeek = this.getWeekNumber();
		let leaderboard = await LeaderboardModel.findOne({ week: currentWeek });

		if (!leaderboard) {
			leaderboard = await this.createWeeklyLeaderboard();
		}

		const users = await UserModel.find(
			{ role: { $nin: [1, 2] } },
			"username avatar_url weekly_xp",
		)
			.sort({ weekly_xp: -1 })
			.limit(limit);

		return {
			week: leaderboard.week,
			start: leaderboard.date_start,
			end: leaderboard.date_end,
			users,
		};
	}

	async createWeeklyLeaderboard() {
		const start = this.getCurrentWeekStart();
		const end = new Date(start);
		end.setDate(start.getDate() + 6);

		const week = this.getWeekNumber();
		const exists = await LeaderboardModel.findOne({ week });
		if (exists) return null;

		return LeaderboardModel.create({
			week,
			rank: 0,
			date_start: start,
			date_end: end,
		});
	}

	getWeekNumber(date = new Date()) {
		const onejan = new Date(date.getFullYear(), 0, 1);
		return Math.ceil(((+date - +onejan) / 86400000 + onejan.getDay() + 1) / 7);
	}

	getCurrentWeekStart() {
		const now = new Date();
		const day = now.getDay(); // 0 = Sunday
		const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
		const monday = new Date(now.setDate(diff));
		monday.setHours(0, 0, 0, 0); // reset to start of day
		return monday;
	}
}
