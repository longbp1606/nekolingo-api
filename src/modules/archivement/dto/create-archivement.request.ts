import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

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

	@ApiProperty()
	@IsNotEmpty()
	condition: JSON;
}
