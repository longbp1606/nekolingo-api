import { Module } from "@nestjs/common";
import { ExerciseService } from "./exercise.service";
import { ExerciseController } from "./exercise.controller";
import { ExplainService } from "./explain.service";
import { AiModule } from "@modules/ai/ai.module";

@Module({
	imports: [AiModule],
	providers: [ExerciseService, ExplainService],
	controllers: [ExerciseController],
	exports: [ExerciseService, ExplainService],
})
export class ExerciseModule {}
