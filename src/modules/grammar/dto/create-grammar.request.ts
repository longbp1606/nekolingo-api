import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateGrammarRequest {
	@ApiProperty({ example: "Present Simple" })
	@IsString()
	name: string;

	@ApiProperty({ example: "Diễn tả một hành động lặp lại, thói quen..." })
	@IsString()
	description: string;

	@ApiProperty({ example: "S + V(s/es) + O" })
	@IsString()
	condition: string;
}
