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
	meaning?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	language_from?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	language_to?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	type?: string;
}
