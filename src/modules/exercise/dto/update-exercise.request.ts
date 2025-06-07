import { PartialType } from "@nestjs/mapped-types";
import { CreateExerciseRequest } from "./create-exercise.request";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEnum,
	IsMongoId,
	IsObject,
	IsOptional,
	IsString,
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
			"true_false",
		],
	})
	@IsOptional()
	@IsEnum([
		"fill_in_blank",
		"match",
		"reorder",
		"image_select",
		"multiple_choice",
		"true_false",
	])
	readonly question_format?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly question?: string;

	@ApiPropertyOptional()
	readonly correct_answer?: any;

	@ApiPropertyOptional({ type: [String] })
	readonly options?: string[];

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

	@ApiPropertyOptional({ type: Object })
	@IsOptional()
	@IsObject()
	readonly extra_data?: Record<string, any>;
}
