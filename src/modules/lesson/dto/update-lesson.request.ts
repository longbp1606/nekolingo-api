import { PartialType } from "@nestjs/mapped-types";
import { CreateLessonRequest } from "./create-lesson.request";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateLessonRequest extends PartialType(CreateLessonRequest) {
	@ApiPropertyOptional({
		example: "Bài học 1: Giới thiệu nâng cao",
		description: "Tiêu đề mới",
	})
	readonly title?: string;

	@ApiPropertyOptional({ example: 2, description: "Thứ tự mới (nếu cập nhật)" })
	readonly order?: number;

	@ApiPropertyOptional({ example: 100, description: "XP mới (nếu cập nhật)" })
	readonly xp_reward?: number;

	@ApiPropertyOptional({
		example: "608e5c7a9b1d2a4b5c6d7e8f",
		description: "ID topic mới (nếu cập nhật)",
		type: String,
	})
	readonly topic?: string;
}
