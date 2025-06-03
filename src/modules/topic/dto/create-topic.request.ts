import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateTopicRequest {
	@ApiProperty()
	@IsString()
	title: string;

	@ApiProperty()
	@IsNumber()
	order: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	description?: string;
}
