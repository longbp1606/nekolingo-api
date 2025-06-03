import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateGrammarRequest {
	@ApiProperty()
	@IsString()
	grammar_id: string;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	description: string;
}
