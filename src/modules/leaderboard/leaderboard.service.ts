import { Injectable } from "@nestjs/common";
import {
	LeaderboardModel,
	WeeklyLeaderboardModel,
	UserModel,
} from "@db/models";

@Injectable()
export class LeaderboardService {
	async getOverallLeaderboard(limit = 30) {
		return UserModel.find({}, "username avatar_url xp")
			.sort({ xp: -1 })
			.limit(limit);
	}

	async createWeeklyLeaderboard() {
		const start = this.getCurrentWeekStart();
		const end = new Date(start);
		end.setDate(start.getDate() + 6);

		const leaderboard = await LeaderboardModel.create({
			week: this.getWeekNumber(),
			rank: 0,
			date_start: start,
			date_end: end,
		});

		const topUsers = await UserModel.find().sort({ weekly_xp: -1 }).limit(30);

		await WeeklyLeaderboardModel.insertMany(
			topUsers.map((user) => ({
				leaderboard_id: leaderboard._id,
				user_id: user._id,
			})),
		);

		return leaderboard;
	}

	getWeekNumber(date = new Date()) {
		const onejan = new Date(date.getFullYear(), 0, 1);
		return Math.ceil(((+date - +onejan) / 86400000 + onejan.getDay() + 1) / 7);
	}

	getCurrentWeekStart() {
		const now = new Date();
		const day = now.getDay();
		const diff = now.getDate() - day + (day === 0 ? -6 : 1);
		return new Date(now.setDate(diff));
	}
	async getWeeklyLeaderboard() {
		const currentWeek = this.getWeekNumber();
		const leaderboard = await LeaderboardModel.findOne({ week: currentWeek });

		if (!leaderboard) return [];

		return WeeklyLeaderboardModel.find({ leaderboard_id: leaderboard._id })
			.populate("user_id", "username avatar_url weekly_xp")
			.sort({ "user_id.weekly_xp": -1 });
	}
}
