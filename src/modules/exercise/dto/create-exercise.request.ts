import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsString,
	IsEnum,
	IsOptional,
	IsMongoId,
	IsArray,
	IsObject,
	IsDefined,
	ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

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
			"listening",
		],
	})
	@IsEnum([
		"fill_in_blank",
		"match",
		"reorder",
		"image_select",
		"multiple_choice",
		"listening",
	])
	question_format: string;

	@ApiProperty()
	@IsString()
	question: string;

	@ApiProperty()
	@IsDefined()
	correct_answer: any;

	@ApiPropertyOptional({
		description: "Mảng lựa chọn: dạng chuỗi hoặc object (string[] | object[])",
		example: ["Option A", { value: "Option B", image: "https://..." }],
		type: [Object],
	})
	@IsOptional()
	@IsArray()
	options?: (string | Record<string, any>)[];

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
		description: "Dữ liệu bổ sung",
		example: {
			hint: "Gợi ý thêm cho học sinh",
		},
	})
	@IsOptional()
	@IsObject()
	extra_data?: Record<string, any>;
}
