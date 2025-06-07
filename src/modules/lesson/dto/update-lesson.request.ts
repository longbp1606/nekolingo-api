import { PartialType } from "@nestjs/swagger";
import { CreateLessonRequest } from "./create-lesson.request";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEnum,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export class UpdateLessonRequest extends PartialType(CreateLessonRequest) {
	@ApiPropertyOptional({
		example: "Bài học 1: Giới thiệu nâng cao",
		description: "Tiêu đề mới",
	})
	@IsOptional()
	@IsString()
	title?: string;

	@ApiPropertyOptional({
		example: 2,
		description: "Thứ tự mới (nếu cập nhật)",
	})
	@IsOptional()
	@IsNumber()
	order?: number;

	@ApiPropertyOptional({
		example: 100,
		description: "XP mới (nếu cập nhật)",
	})
	@IsOptional()
	@IsNumber()
	xp_reward?: number;

	@ApiPropertyOptional({
		example: "665f2d439b61bdf74e06b7d5",
		description: "ID Topic mới (nếu cập nhật)",
	})
	@IsOptional()
	@IsMongoId()
	topic?: string;

	@ApiPropertyOptional({
		example: "grammar",
		enum: ["vocabulary", "grammar", "listening", "reading", "speaking"],
		description: "Loại bài học mới (nếu cập nhật)",
	})
	@IsOptional()
	@IsEnum(["vocabulary", "grammar", "listening", "reading", "speaking"])
	type?: "vocabulary" | "grammar" | "listening" | "reading" | "speaking";

	@ApiPropertyOptional({
		example: "Cập nhật mô tả bài học.",
		description: "Mô tả mới (nếu cập nhật)",
	})
	@IsOptional()
	@IsString()
	description?: string;
}
