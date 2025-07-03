import { ApiProperty } from "@nestjs/swagger";
import { CreateUserRequest } from "./create-user.request";

export class UpdateUserRequest extends CreateUserRequest {
	@ApiProperty()
	current_course: string;
}
