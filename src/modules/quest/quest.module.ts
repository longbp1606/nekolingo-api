import { Module } from "@nestjs/common";
import { QuestService } from "./quest.service";
import { QuestController } from "./quest.controller";
import { AuthModule } from "@modules/auth";

@Module({
	imports: [AuthModule],
	providers: [QuestService],
	controllers: [QuestController],
	exports: [QuestService],
})
export class QuestModule {}
