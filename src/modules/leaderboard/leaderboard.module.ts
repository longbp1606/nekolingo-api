import { Module } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { LeaderboardController } from "./leaderboard.controller";
import { AuthModule } from "@modules/auth";

@Module({
	imports: [AuthModule],
	providers: [LeaderboardService],
	controllers: [LeaderboardController],
	exports: [LeaderboardService],
})
export class LeaderboardModule {}
