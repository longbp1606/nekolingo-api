import { ApiProperty } from "@nestjs/swagger";

export class VocabularyResponse {
	@ApiProperty()
	_id: string;

	@ApiProperty()
	word: string;

	@ApiProperty()
	meaning: string;

	@ApiProperty()
	language_from: string;

	@ApiProperty()
	language_to: string;

	@ApiProperty({ required: false })
	type?: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
