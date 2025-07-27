import { ApiProperty } from "@nestjs/swagger";
import { CreateUserRequest } from "./create-user.request";
import { IsOptional } from "class-validator";

export class UpdateUserRequest extends CreateUserRequest {
	@ApiProperty()
	current_course: string;

	@ApiProperty()
	@IsOptional()
	balance: number;
}
