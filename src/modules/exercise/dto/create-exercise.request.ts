import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsArray,
	IsEnum,
	IsMongoId,
	IsObject,
	IsOptional,
	IsString,
	ValidateIf,
} from "class-validator";

export class CreateExerciseRequest {
	@ApiProperty({
		enum: ["vocabulary", "grammar", "listening", "reading", "speaking"],
	})
	@IsEnum(["vocabulary", "grammar", "listening", "reading", "speaking"])
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

	@ApiProperty({
		description:
			"Đáp án đúng. Có thể là string, mảng string, number hoặc object",
	})
	@IsString()
	correct_answer: any;

	@ApiPropertyOptional({ type: [String] })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
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

	@ApiPropertyOptional({
		description: "Dữ liệu bổ sung cho bài tập (nếu có)",
		type: Object,
	})
	@IsOptional()
	@IsObject()
	extra_data?: Record<string, any>;
}
