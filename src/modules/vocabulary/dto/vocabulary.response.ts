import { ApiProperty } from "@nestjs/swagger";

export class VocabularyResponse {
	@ApiProperty()
	_id: string;

	@ApiProperty()
	vocabulary_id: string;

	@ApiProperty()
	word: string;

	@ApiProperty({ required: false })
	pronunciation_us?: string;

	@ApiProperty({ required: false })
	pronunciation_uk?: string;

	@ApiProperty()
	meaning: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
