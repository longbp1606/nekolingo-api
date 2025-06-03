import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNumber, IsString } from "class-validator";

export class CreateLessonRequest {
	@ApiProperty({
		example: "Bài học 1: Giới thiệu",
		description: "Tiêu đề bài học",
	})
	@IsString()
	title: string;

	@ApiProperty({
		example: 1,
		description: "Thứ tự của bài học trong cùng một topic",
	})
	@IsNumber()
	order: number;

	@ApiProperty({ example: 50, description: "XP thưởng khi hoàn thành" })
	@IsNumber()
	xp_reward: number;

	@ApiProperty({
		example: "608e5c7a9b1d2a4b5c6d7e8f",
		description: "ID của Topic",
		type: String,
	})
	@IsMongoId()
	topic: string;
}
