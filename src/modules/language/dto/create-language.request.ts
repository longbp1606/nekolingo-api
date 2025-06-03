import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsUrl } from "class-validator";

export class CreateLanguageRequest {
	@ApiProperty({ example: "Tiếng Anh", description: "Tên ngôn ngữ" })
	@IsString()
	readonly name: string;

	@ApiProperty({ example: "en", description: "Mã ngôn ngữ (en, vi, jp,...)" })
	@IsString()
	readonly code: string;

	@ApiProperty({
		example: "https://example.com/flag-en.png",
		description: "URL tới icon/flag (tùy chọn)",
		required: false,
	})
	@IsOptional()
	@IsUrl()
	readonly flag_url?: string;
}
