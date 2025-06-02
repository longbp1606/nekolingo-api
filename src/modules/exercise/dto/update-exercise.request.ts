import { PartialType } from "@nestjs/mapped-types";
import { CreateExerciseRequest } from "./create-exercise.request";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateExerciseRequest extends PartialType(CreateExerciseRequest) {
	@ApiPropertyOptional({
		example: "fill-in-blank",
		description: "Loại mới (nếu cập nhật)",
	})
	readonly type?: string;

	@ApiPropertyOptional({
		example: "What is the capital of Germany?",
		description: "Câu hỏi mới (nếu cập nhật)",
	})
	readonly question?: string;

	@ApiPropertyOptional({
		example: "Berlin",
		description: "Đáp án mới (nếu cập nhật)",
	})
	readonly correct_answer?: string;

	@ApiPropertyOptional({
		example: ["Berlin", "Paris", "Rome", "Madrid"],
		description: "Các lựa chọn mới (nếu cập nhật)",
		type: [String],
	})
	readonly options?: string[];

	@ApiPropertyOptional({
		example: "60f1c5d0e47f5c4c8f9d6789",
		description: "ID lesson mới (nếu cập nhật)",
		type: String,
	})
	readonly lesson?: string;

	@ApiPropertyOptional({
		example: "60f1e7f0e58a6d5e9f9e8901",
		description: "ID vocabulary mới (nếu cập nhật)",
		type: String,
	})
	readonly vocabulary?: string;

	@ApiPropertyOptional({
		example: "60f1f8a1f68b7d6f9f9e9012",
		description: "ID grammar mới (nếu cập nhật)",
		type: String,
	})
	readonly grammar?: string;
}
