import { ApiProperty } from "@nestjs/swagger";
import {
	IsMongoId,
	IsDefined,
	IsNumber,
	Min,
	IsOptional,
} from "class-validator";

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
	@IsOptional()
	@IsNumber()
	@Min(0)
	answer_time?: number;
}
