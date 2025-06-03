import { Module } from "@nestjs/common";
import { GrammarService } from "./grammar.service";
import { GrammarController } from "./grammar.controller";

@Module({
	providers: [GrammarService],
	exports: [GrammarService],
	controllers: [GrammarController],
})
export class GrammarModule {}
