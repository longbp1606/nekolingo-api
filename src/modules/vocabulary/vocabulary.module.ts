import { Module } from "@nestjs/common";
import { VocabularyService } from "./vocabulary.service";
import { VocabularyController } from "./vocabulary.controller";

@Module({
	providers: [VocabularyService],
	exports: [VocabularyService],
	controllers: [VocabularyController],
})
export class VocabularyModule {}
