import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateGrammarRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	condition?: string;
}
