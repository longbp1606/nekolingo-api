import { PartialType } from "@nestjs/mapped-types";
import { CreateExerciseRequest } from "./create-exercise.request";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEnum,
	IsMongoId,
	IsObject,
	IsOptional,
	IsString,
	IsArray,
} from "class-validator";

export class UpdateExerciseRequest extends PartialType(CreateExerciseRequest) {
	@ApiPropertyOptional({
		enum: ["vocabulary", "grammar", "listening", "reading", "speaking"],
	})
	@IsOptional()
	@IsEnum(["vocabulary", "grammar", "listening", "reading", "speaking"])
	readonly type?: string;

	@ApiPropertyOptional({
		enum: [
			"fill_in_blank",
			"match",
			"reorder",
			"image_select",
			"multiple_choice",
			"listening",
		],
	})
	@IsOptional()
	@IsEnum([
		"fill_in_blank",
		"match",
		"reorder",
		"image_select",
		"multiple_choice",
		"listening",
	])
	readonly question_format?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly question?: string;

	@ApiPropertyOptional()
	@IsOptional()
	readonly correct_answer?: any;

	@ApiPropertyOptional({
		description: "Tùy chọn: chuỗi, object, mảng, bất kỳ",
		example: ["Option A", { value: "Option B", image: "https://..." }],
	})
	@IsOptional()
	options?: any;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly audio_url?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly image_url?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	readonly lesson?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	readonly vocabulary?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	readonly grammar?: string;

	@ApiPropertyOptional({
		description: "Dữ liệu mở rộng",
		example: {
			note: "Câu hỏi nâng cao",
		},
	})
	@IsOptional()
	@IsObject()
	readonly extra_data?: Record<string, any>;
}
