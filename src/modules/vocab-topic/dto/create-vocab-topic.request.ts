import { ApiProperty } from "@nestjs/swagger";
import {
	IsString,
	IsNumber,
	IsBoolean,
	IsOptional,
	IsMongoId,
} from "class-validator";

export class CreateVocabTopicRequest {
	@ApiProperty()
	@IsMongoId()
	topic: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsMongoId()
	vocabulary?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsMongoId()
	grammar?: string;

	@ApiProperty()
	@IsNumber()
	order: number;

	@ApiProperty({ default: true })
	@IsOptional()
	@IsBoolean()
	is_required?: boolean;
}
