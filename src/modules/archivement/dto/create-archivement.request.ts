import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsObject } from "class-validator";

export class CreateArchivementRequest {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	title: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	icon: string;

	@ApiProperty({
		type: Object,
		example: {
			type: "complete_lessons",
			value: 10,
		},
	})
	@IsNotEmpty()
	@IsObject()
	condition: Record<string, any>;
}
