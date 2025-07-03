import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiResponseDto, SwaggerApiResponse } from "@utils";
import { CreateUserRequest } from "./dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UpdateUserRequest } from "./dto/update-user.request";

@Controller("user")
@ApiBearerAuth()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@SwaggerApiResponse(Object)
	async getUsers() {
		const users = await this.userService.getUsers();
		return new ApiResponseDto(users, null, "Get users successfully");
	}

	@Get(":id")
	@SwaggerApiResponse(Object)
	async getUserById(@Param("id") id: string) {
		const user = await this.userService.getUserById(id);
		return new ApiResponseDto(user, null, "Get user successfully");
	}

	@Post()
	@SwaggerApiResponse(Object)
	async createUser(@Body() dto: CreateUserRequest) {
		await this.userService.createUser(dto);
		return new ApiResponseDto(null, null, "Account created successfully");
	}

	@Patch(":id")
	@SwaggerApiResponse(Object)
	async updateUser(@Param("id") id: string, @Body() dto: UpdateUserRequest) {
		await this.userService.updateUser(id, dto);
		return new ApiResponseDto(null, null, "Account updated successfully");
	}

	@Delete(":id")
	@SwaggerApiResponse(Object)
	async deleteUser(@Param("id") id: string) {
		await this.userService.deleteUser(id);
		return new ApiResponseDto(null, null, "Account deleted successfully");
	}
}
