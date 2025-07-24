import { Module } from "@nestjs/common";
import { UserProgressService } from "./user-progress.service";
import { UserProgressController } from "./user-progress.controller";
import { UserStreakModule } from "@modules/user-streak/user-streak.module";
import { QuestModule } from "@modules/quest/quest.module";
import { ExerciseModule } from "@modules/exercise";
import { AiModule } from "@modules/ai/ai.module";
import { ArchivementModule } from "@modules/archivement";
@Module({
	imports: [
		UserStreakModule,
		QuestModule,
		ExerciseModule,
		AiModule,
		ArchivementModule,
	],
	controllers: [UserProgressController],
	providers: [UserProgressService],
})
export class UserProgressModule {}
