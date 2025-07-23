import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GeminiService } from "./gemini.service";
import { ExplainService } from "@modules/exercise/explain.service";
import { PersonalizedLessonService } from "./personalized-lesson.service";

@Module({
	imports: [ConfigModule],
	providers: [GeminiService, ExplainService, PersonalizedLessonService],
	exports: [GeminiService, ExplainService, PersonalizedLessonService],
})
export class AiModule {}
