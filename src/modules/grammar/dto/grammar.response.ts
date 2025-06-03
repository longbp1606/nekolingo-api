import { ApiProperty } from "@nestjs/swagger";

export class GrammarResponse {
	@ApiProperty()
	_id: string;

	@ApiProperty()
	grammar_id: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
