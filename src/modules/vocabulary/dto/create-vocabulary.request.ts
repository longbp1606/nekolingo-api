import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CreateVocabularyRequest {
	@ApiProperty()
	@IsString()
	vocabulary_id: string;

	@ApiProperty()
	@IsString()
	word: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	pronunciation_us?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	pronunciation_uk?: string;

	@ApiProperty()
	@IsString()
	meaning: string;
}
