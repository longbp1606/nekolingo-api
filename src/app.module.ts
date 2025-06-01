import { GrammarModule } from "@modules/grammar";
import { TopicModule } from "@modules/topic";
import { UserModule } from "@modules/user";
import { VocabularyModule } from "@modules/vocabulary";
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { MyExceptionFilter, ValidationPipe } from "@utils";

@Module({
	imports: [UserModule, TopicModule, GrammarModule, VocabularyModule],
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
	],
})
export class AppModule {}
