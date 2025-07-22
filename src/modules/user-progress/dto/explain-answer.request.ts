import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class ExplainAnswerRequestDto {
	@ApiProperty({ example: "684f8ad5d0547d12c275f5f5" })
	@IsMongoId()
	user_id: string;

	@ApiProperty({ example: "684f8ad5d0547d12c275f5f5" })
	@IsMongoId()
	exercise_id: string;
}
