import { ApiProperty } from "@nestjs/swagger";

export class TopicResponse {
	@ApiProperty()
	_id: string;

	@ApiProperty()
	title: string;

	@ApiProperty()
	order: number;

	@ApiProperty({ required: false })
	description?: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
