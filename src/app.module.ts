import { CourseModule } from "@modules/course";
import { ExerciseModule } from "@modules/exercise";
import { GrammarModule } from "@modules/grammar";
import { LanguageModule } from "@modules/language";
import { LessonModule } from "@modules/lesson";
import { TopicModule } from "@modules/topic";
import { UserModule } from "@modules/user";
import { VocabularyModule } from "@modules/vocabulary";
import { VocabTopicModule } from "@modules/vocab-topic";
import { ArchivementModule } from "@modules/archivement";
import { UserArchivementModule } from "@modules/user-archivement";
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { MyExceptionFilter, ValidationPipe } from "@utils";
import { AuthGuard, AuthModule } from "@modules/auth";
import { UserProgressModule } from "@modules/user-progress";
import { WalletModule } from "./modules/wallet/wallet.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { QuestModule } from "@modules/quest/quest.module";
import { LeaderboardModule } from "@modules/leaderboard/leaderboard.module";
import { TaskScheduler } from "./scheduler/task.scheduler";
import { ClsModule } from "nestjs-cls";
import { UploadModule } from "@modules/upload";
import { CloudinaryModule } from "@providers/cloudinary";
import { ImageModule } from "@modules/image";
import { UserStreakModule } from "@modules/user-streak/user-streak.module";
import { AiModule } from "@modules/ai/ai.module";

@Module({
	imports: [
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
			},
		}),
		ConfigModule.forRoot({ isGlobal: true }),
		ScheduleModule.forRoot(),
		AuthModule,
		UserModule,
		LanguageModule,
		CourseModule,
		TopicModule,
		LessonModule,
		ExerciseModule,
		GrammarModule,
		UserProgressModule,
		VocabularyModule,
		VocabTopicModule,
		ArchivementModule,
		UserArchivementModule,
		WalletModule,
		QuestModule,
		LeaderboardModule,
		UploadModule,
		CloudinaryModule,
		ImageModule,
		UserStreakModule,
		AiModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_FILTER,
			useClass: MyExceptionFilter,
		},
		{
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},
		{
			provide: "APP_GUARD",
			useClass: AuthGuard,
		},
		TaskScheduler,
	],
})
export class AppModule {}
