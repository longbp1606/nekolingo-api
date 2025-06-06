import { Module } from "@nestjs/common";
import { VocabTopicService } from "./vocab-topic.service";
import { VocabTopicController } from "./vocab-topic.controller";

@Module({
	providers: [VocabTopicService],
	exports: [VocabTopicService],
	controllers: [VocabTopicController],
})
export class VocabTopicModule {}
