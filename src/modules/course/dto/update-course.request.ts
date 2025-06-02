import { PartialType } from "@nestjs/mapped-types";
import { CreateCourseRequest } from "./create-course.request";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCourseRequest extends PartialType(CreateCourseRequest) {
	@ApiPropertyOptional({
		example: "Intermediate English A2",
		description: "Tiêu đề mới",
	})
	readonly title?: string;

	@ApiPropertyOptional({
		example: "Mô tả mới",
		description: "Mô tả mới (nếu cập nhật)",
	})
	readonly description?: string;

	@ApiPropertyOptional({
		example: "60f1a3b8c25e3a2a7f9d1234",
		description: "ID ngôn ngữ từ mới",
		type: String,
	})
	readonly language_from?: string;

	@ApiPropertyOptional({
		example: "60f1a3b8c25e3a2a7f9d5678",
		description: "ID ngôn ngữ đến mới",
		type: String,
	})
	readonly language_to?: string;
}
