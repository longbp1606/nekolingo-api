import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional } from "class-validator";

export class UpdateTopicRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	title?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	order?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	description?: string;
}
