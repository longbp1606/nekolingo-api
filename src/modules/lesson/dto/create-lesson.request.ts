import { ApiProperty } from "@nestjs/swagger";
import {
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export class CreateLessonRequest {
	@ApiProperty({
		example: "Bài học 1: Giới thiệu",
		description: "Tiêu đề bài học",
	})
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		example: 1,
		description: "Thứ tự của bài học trong cùng một topic",
	})
	@IsNumber()
	order: number;

	@ApiProperty({
		example: 50,
		description: "XP thưởng khi hoàn thành",
	})
	@IsNumber()
	xp_reward: number;

	@ApiProperty({
		example: "665f2d439b61bdf74e06b7d5",
		description: "ID của Topic",
	})
	@IsMongoId()
	topic: string;

	@ApiProperty({
		example: "vocabulary",
		enum: ["vocabulary", "grammar", "listening", "reading", "speaking"],
		description: "Loại bài học",
	})
	@IsEnum(["vocabulary", "grammar", "listening", "reading", "speaking"])
	type: "vocabulary" | "grammar" | "listening" | "reading" | "speaking";

	@ApiProperty({
		example: "Bài học giới thiệu các từ vựng cơ bản.",
		description: "Mô tả ngắn gọn về bài học",
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;
}
