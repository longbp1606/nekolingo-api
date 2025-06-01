import { ArchivementModule } from "@modules/archivement";
import { UserModule } from "@modules/user";
import { UserArchivementModule } from "@modules/user-archivement";
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { MyExceptionFilter, ValidationPipe } from "@utils";

@Module({
	imports: [UserModule, ArchivementModule, UserArchivementModule],
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
