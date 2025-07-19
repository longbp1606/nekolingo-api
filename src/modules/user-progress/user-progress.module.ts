import { Module } from "@nestjs/common";
import { UserProgressService } from "./user-progress.service";
import { UserProgressController } from "./user-progress.controller";
import { UserStreakModule } from "@modules/user-streak/user-streak.module";
import { QuestModule } from "@modules/quest/quest.module";
@Module({
	imports: [UserStreakModule, QuestModule],
	controllers: [UserProgressController],
	providers: [UserProgressService],
})
export class UserProgressModule {}
