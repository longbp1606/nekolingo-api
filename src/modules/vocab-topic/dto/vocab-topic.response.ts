import { ApiProperty } from "@nestjs/swagger";

export class VocabTopicResponse {
	@ApiProperty()
	_id: string;

	@ApiProperty()
	topic: string;

	@ApiProperty({ required: false })
	vocabulary?: string;

	@ApiProperty({ required: false })
	grammar?: string;

	@ApiProperty()
	order: number;

	@ApiProperty()
	is_required: boolean;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
