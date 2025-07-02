import { PartialType, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsArray,
	IsEnum,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
	ArrayNotEmpty,
} from "class-validator";
import { CreateLessonRequest } from "./create-lesson.request";

export class UpdateLessonRequest extends PartialType(CreateLessonRequest) {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	title?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	order?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	xp_reward?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	topic?: string;

	@ApiPropertyOptional({
		example: ["speaking", "listening"],
	})
	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	type?: string[];

	@ApiPropertyOptional({
		enum: ["normal", "personalized", "mixed"],
	})
	@IsOptional()
	@IsEnum(["normal", "personalized", "mixed"])
	mode?: "normal" | "personalized" | "mixed";

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	description?: string;
}
