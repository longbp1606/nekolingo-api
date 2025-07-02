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

@Module({
	imports: [
		AuthModule,
		UserModule,
		TopicModule,
		GrammarModule,
		VocabularyModule,
		VocabTopicModule,
		LanguageModule,
		CourseModule,
		LessonModule,
		ExerciseModule,
		ArchivementModule,
		UserArchivementModule,
		UserProgressModule,
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
	],
})
export class AppModule {}
