import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsString,
	IsEnum,
	IsOptional,
	IsMongoId,
	IsArray,
	IsObject,
	ValidateNested,
	IsDefined,
} from "class-validator";

export class CreateExerciseRequest {
	@ApiProperty({
		description: "Loại nội dung của bài tập",
		example: "vocabulary",
	})
	@IsString()
	type: string;

	@ApiProperty({
		enum: [
			"fill_in_blank",
			"match",
			"reorder",
			"image_select",
			"multiple_choice",
			"true_false",
		],
	})
	@IsEnum([
		"fill_in_blank",
		"match",
		"reorder",
		"image_select",
		"multiple_choice",
		"true_false",
	])
	question_format: string;

	@ApiProperty()
	@IsString()
	question: string;

	@ApiProperty()
	@IsDefined()
	correct_answer: any;

	@ApiPropertyOptional({ type: [String] })
	@IsOptional()
	@IsArray()
	options?: string[];

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	audio_url?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	image_url?: string;

	@ApiProperty()
	@IsMongoId()
	lesson: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	vocabulary?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	grammar?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsObject()
	extra_data?: Record<string, any>;
}
