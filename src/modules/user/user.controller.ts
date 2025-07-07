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
import { UpdateUserRequest } from "./dto/update-user.request";
import {
	ApiBearerAuth,
	ApiTags,
	ApiOperation,
	ApiParam,
	ApiBody,
} from "@nestjs/swagger";

@ApiTags("User")
@ApiBearerAuth()
@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@ApiOperation({
		summary: "Lấy danh sách người dùng đang hoạt động (is_active = true)",
	})
	@SwaggerApiResponse(Object)
	async getUsers() {
		const users = await this.userService.getUsers();
		return new ApiResponseDto(users, null, "Get users successfully");
	}

	@Get(":id")
	@ApiOperation({
		summary: "Lấy thông tin chi tiết người dùng bao gồm tiến độ học tập",
	})
	@ApiParam({ name: "id", description: "ID của người dùng" })
	@SwaggerApiResponse(Object)
	async getUserById(@Param("id") id: string) {
		const user = await this.userService.getUserById(id);
		return new ApiResponseDto(user, null, "Get user successfully");
	}

	@Post()
	@ApiOperation({ summary: "Tạo người dùng mới" })
	@ApiBody({ type: CreateUserRequest })
	@SwaggerApiResponse(Object)
	async createUser(@Body() dto: CreateUserRequest) {
		await this.userService.createUser(dto);
		return new ApiResponseDto(null, null, "Account created successfully");
	}

	@Patch(":id")
	@ApiOperation({ summary: "Cập nhật thông tin người dùng" })
	@ApiParam({ name: "id", description: "ID của người dùng" })
	@ApiBody({ type: UpdateUserRequest })
	@SwaggerApiResponse(Object)
	async updateUser(@Param("id") id: string, @Body() dto: UpdateUserRequest) {
		await this.userService.updateUser(id, dto);
		return new ApiResponseDto(null, null, "Account updated successfully");
	}

	@Delete(":id")
	@ApiOperation({ summary: "Xóa mềm người dùng (set is_active = false)" })
	@ApiParam({ name: "id", description: "ID của người dùng" })
	@SwaggerApiResponse(Object)
	async deleteUser(@Param("id") id: string) {
		await this.userService.deleteUser(id);
		return new ApiResponseDto(null, null, "Account deleted successfully");
	}
}
