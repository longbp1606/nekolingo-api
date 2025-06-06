import { Module } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { LessonController } from "./lesson.controller";

@Module({
	providers: [LessonService],
	controllers: [LessonController],
	exports: [LessonService],
})
export class LessonModule {}
