import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";

export class CreateExerciseRequest {
	@ApiProperty({ example: "multiple-choice", description: "Loại bài tập" })
	@IsString()
	type: string;

	@ApiProperty({
		example: "What is the capital of France?",
		description: "Nội dung câu hỏi",
	})
	@IsString()
	question: string;

	@ApiProperty({ example: "Paris", description: "Đáp án đúng" })
	@IsString()
	correct_answer: string;

	@ApiProperty({
		example: ["Paris", "London", "Berlin", "Madrid"],
		description: "Các lựa chọn (nếu multiple-choice)",
		required: false,
		type: [String],
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	options?: string[];

	@ApiProperty({
		example: "https://example.com/audio1.mp3",
		description: "URL audio (nếu có)",
		required: false,
	})
	@IsOptional()
	@IsString()
	audio_url?: string;

	@ApiProperty({
		example: "https://example.com/image1.png",
		description: "URL hình ảnh (nếu có)",
		required: false,
	})
	@IsOptional()
	@IsString()
	image_url?: string;

	@ApiProperty({
		example: "60f1c5d0e47f5c4c8f9d6789",
		description: "ID của Lesson",
		type: String,
	})
	@IsMongoId()
	lesson: string;

	@ApiProperty({
		example: "60f1e7f0e58a6d5e9f9e8901",
		description: "ID của Vocabulary (nếu có)",
		required: false,
		type: String,
	})
	@IsOptional()
	@IsMongoId()
	vocabulary?: string;

	@ApiProperty({
		example: "60f1f8a1f68b7d6f9f9e9012",
		description: "ID của Grammar (nếu có)",
		required: false,
		type: String,
	})
	@IsOptional()
	@IsMongoId()
	grammar?: string;
}
