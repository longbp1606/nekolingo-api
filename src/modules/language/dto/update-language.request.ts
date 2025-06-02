import { PartialType } from "@nestjs/mapped-types";
import { CreateLanguageRequest } from "./create-language.request";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateLanguageRequest extends PartialType(CreateLanguageRequest) {
	@ApiPropertyOptional({
		example: "Tiếng Pháp",
		description: "Tên mới (nếu cập nhật)",
	})
	readonly name?: string;

	@ApiPropertyOptional({ example: "fr", description: "Mã mới (nếu cập nhật)" })
	readonly code?: string;

	@ApiPropertyOptional({
		example: "https://example.com/flag-fr.png",
		description: "URL mới (nếu cập nhật)",
	})
	readonly flag_url?: string;
}
