import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsMongoId } from "class-validator";

export class CreateVocabularyRequest {
	@ApiProperty()
	@IsString()
	word: string;

	@ApiProperty()
	@IsString()
	meaning: string;

	@ApiProperty()
	@IsMongoId()
	language_from: string;

	@ApiProperty()
	@IsMongoId()
	language_to: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	type?: string;
}
