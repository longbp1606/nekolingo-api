import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@modules/auth";

@ApiTags("Leaderboard")
@ApiBearerAuth()
@Controller("leaderboard")
export class LeaderboardController {
	constructor(private readonly leaderboardService: LeaderboardService) {}

	@Get("overall")
	@ApiOperation({ summary: "Lấy bảng xếp hạng tổng theo XP" })
	@UseGuards(AuthGuard)
	async getOverallLeaderboard() {
		return this.leaderboardService.getOverallLeaderboard();
	}

	@Post("generate-weekly")
	@ApiOperation({ summary: "Tạo bảng xếp hạng tuần" })
	@UseGuards(AuthGuard)
	async generateWeekly() {
		return this.leaderboardService.createWeeklyLeaderboard();
	}
	@Get("weekly")
	@ApiOperation({ summary: "Lấy bảng xếp hạng tuần hiện tại" })
	@UseGuards(AuthGuard)
	async getWeeklyLeaderboard() {
		return this.leaderboardService.getWeeklyLeaderboard();
	}
}
