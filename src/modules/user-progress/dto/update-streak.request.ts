import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class UpdateStreakRequest {
	@ApiProperty()
	@IsMongoId()
	user_id: string;
}
