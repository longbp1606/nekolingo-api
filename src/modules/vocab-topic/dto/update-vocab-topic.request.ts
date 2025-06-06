import { ApiProperty } from "@nestjs/swagger";
import {
	IsString,
	IsNumber,
	IsBoolean,
	IsOptional,
	IsMongoId,
} from "class-validator";

export class UpdateVocabTopicRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsMongoId()
	vocabulary?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsMongoId()
	grammar?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	order?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBoolean()
	is_required?: boolean;
}
