import { ApiProperty } from "@nestjs/swagger";
import {
	IsMongoId,
	ValidateNested,
	IsArray,
	IsOptional,
	IsNumber,
} from "class-validator";
import { Type } from "class-transformer";

class ExerciseAnswerDto {
	@ApiProperty()
	@IsMongoId()
	exercise_id: string;

	@ApiProperty()
	user_answer: any;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	answer_time?: number;
}

export class CompleteFullLessonDto {
	@ApiProperty()
	@IsMongoId()
	user_id: string;

	@ApiProperty()
	@IsMongoId()
	lesson_id: string;

	@ApiProperty({ type: [ExerciseAnswerDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ExerciseAnswerDto)
	exercises: ExerciseAnswerDto[];
}
