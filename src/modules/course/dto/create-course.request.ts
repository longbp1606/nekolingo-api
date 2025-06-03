import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsMongoId, IsOptional } from "class-validator";

export class CreateCourseRequest {
	@ApiProperty({ example: "English Basic A1", description: "Tiêu đề khóa học" })
	@IsString()
	title: string;

	@ApiProperty({
		example: "Khóa cơ bản cho người mới bắt đầu",
		description: "Mô tả (tùy chọn)",
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({
		example: "60f1a3b8c25e3a2a7f9d1234",
		description: "ID ngôn ngữ gốc (language from)",
		type: String,
	})
	@IsMongoId()
	language_from: string;

	@ApiProperty({
		example: "60f1a3b8c25e3a2a7f9d5678",
		description: "ID ngôn ngữ đích (language to)",
		type: String,
	})
	@IsMongoId()
	language_to: string;
}
