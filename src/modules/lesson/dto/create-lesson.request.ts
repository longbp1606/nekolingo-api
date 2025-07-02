import { ApiProperty } from "@nestjs/swagger";
import {
	IsArray,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsEnum,
	ArrayNotEmpty,
	ArrayMinSize,
} from "class-validator";

export class CreateLessonRequest {
	@ApiProperty({ example: "Lesson 1: Introduction" })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 1 })
	@IsNumber()
	order: number;

	@ApiProperty({ example: 50 })
	@IsNumber()
	xp_reward: number;

	@ApiProperty({ example: "665f2d439b61bdf74e06b7d5" })
	@IsMongoId()
	topic: string;

	@ApiProperty({
		example: ["vocabulary", "reading"],
		description: "Các dạng kỹ năng trong bài học",
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	type: string[];

	@ApiProperty({
		example: "normal",
		enum: ["normal", "personalized", "mixed"],
	})
	@IsEnum(["normal", "personalized", "mixed"])
	mode: "normal" | "personalized" | "mixed";

	@ApiProperty({ example: "Giới thiệu các từ vựng cơ bản", required: false })
	@IsOptional()
	@IsString()
	description?: string;
}
