import { Module } from "@nestjs/common";
import { UserProgressService } from "./user-progress.service";
import { UserProgressController } from "./user-progress.controller";
import { UserStreakModule } from "@modules/user-streak/user-streak.module";

@Module({
	imports: [UserStreakModule],
	controllers: [UserProgressController],
	providers: [UserProgressService],
})
export class UserProgressModule {}
