import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt } from "class-validator";

export class CreateQuestRequest {
	@ApiProperty({ example: "Hoàn thành 1 bài học" })
	@IsString()
	title: string;

	@ApiProperty({ example: "https://example.com/icon.png" })
	@IsString()
	icon: string;

	@ApiProperty({ example: 50 })
	@IsInt()
	reward: number;

	@ApiProperty({ example: "complete_lesson_1" })
	@IsString()
	condition: string;
}
