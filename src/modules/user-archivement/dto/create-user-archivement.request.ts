import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateUserArchivementRequest {
	@ApiProperty()
	@IsNotEmpty()
	@IsMongoId()
	user_id: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsMongoId()
	archivement_id: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	unlock_at?: Date;
}
