import { IsMongoId } from "class-validator";

export class ExplainAnswerRequestDto {
	@IsMongoId()
	user_id: string;

	@IsMongoId()
	exercise_id: string;
}
