import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsDefined } from "class-validator";

export class SubmitExerciseDto {
	@ApiProperty()
	@IsMongoId()
	user_id: string;

	@ApiProperty()
	@IsMongoId()
	exercise_id: string;

	@ApiProperty()
	@IsDefined()
	user_answer: any;

	@ApiProperty()
	answer_time: number;
}
