import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateVocabularyRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	word?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	pronunciation_us?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	pronunciation_uk?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	meaning?: string;
}
