import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModel, UserStreakProgressModel } from "@db/models";
import { UserStreakService } from "./user-streak.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: UserModel.modelName, schema: UserModel.schema },
			{
				name: UserStreakProgressModel.modelName,
				schema: UserStreakProgressModel.schema,
			},
		]),
	],
	controllers: [],
	providers: [UserStreakService],
	exports: [UserStreakService],
})
export class UserStreakModule {}
