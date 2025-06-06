import { Module } from "@nestjs/common";
import { TopicService } from "./topic.service";
import { TopicController } from "./topic.controller";

@Module({
	providers: [TopicService],
	exports: [TopicService],
	controllers: [TopicController],
})
export class TopicModule {}
