import { ApiProperty } from "@nestjs/swagger";
import { CreateUserRequest } from "./create-user.request";
import { IsOptional, IsString, IsNumber, IsBoolean } from "class-validator";

export class UpdateUserRequest extends CreateUserRequest {
	@ApiProperty()
	@IsOptional()
	@IsString()
	current_course?: string;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	balance?: number;

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	is_active?: boolean;
}
