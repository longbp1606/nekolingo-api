import { ApiProperty } from "@nestjs/swagger";

export class GetImageListRequest {
	constructor(page: number, take: number) {
		this.page = page;
		this.take = take;
	}

	@ApiProperty()
	page: number;

	@ApiProperty()
	take: number;
}
