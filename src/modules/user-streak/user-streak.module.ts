import { Module } from "@nestjs/common";
import { UserStreakService } from "./user-streak.service";

@Module({
	providers: [UserStreakService],
	exports: [UserStreakService],
})
export class UserStreakModule {}
