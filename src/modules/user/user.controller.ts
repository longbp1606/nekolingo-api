import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiResponseDto, SwaggerApiResponse } from "@utils";
import { CreateUserRequest } from "./dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("user")
@ApiBearerAuth()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@SwaggerApiResponse(Object)
	async createUser(@Body() dto: CreateUserRequest) {
		await this.userService.createUser(dto);
		return new ApiResponseDto(null, null, "Account created successfully");
	}
}
