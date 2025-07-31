import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
} from "@nestjs/common";
import { SkipAuth } from "./skip-auth.decorator";
import { ApiResponseDto, SwaggerApiResponse } from "@utils";
import { BasicLoginRequest, BasicRegisterRequest, TokenResponse } from "./dto";
import { AuthService } from "./auth.service";
import { UserResponse } from "@modules/user/dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { SetupRegisterRequest } from "./dto/setup-register.request";
import { UserModel } from "@db/models";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@SkipAuth()
	@SwaggerApiResponse(TokenResponse)
	async login(@Body() dto: BasicLoginRequest) {
		const data = await this.authService.basicLogin(dto);
		return new ApiResponseDto(data, null, "Login successfully!");
	}

	@Post("register")
	@SkipAuth()
	@SwaggerApiResponse(ApiResponseDto)
	async register(@Body() dto: BasicRegisterRequest) {
		await this.authService.basicRegister(dto);
		return new ApiResponseDto(null, null, "Register successfully!");
	}

	@Post("setup-register")
	@SkipAuth()
	async setupRegister(@Body() dto: SetupRegisterRequest) {
		await this.authService.setupRegister(dto);
		return new ApiResponseDto(null, null, "Setup register successfully!");
	}

	@Get("profile")
	@SwaggerApiResponse(UserResponse)
	@ApiBearerAuth()
	async getProfile() {
		const data = this.authService.getProfileCls();
		return new ApiResponseDto(data, null, "Get profile successfully!");
	}

	@Get("verify-email")
	@SkipAuth()
	async verifyEmail(@Query("token") token: string) {
		if (!token) throw new BadRequestException("Thiếu token xác thực");

		const user = await UserModel.findOne({ email_verify_token: token });
		if (!user)
			throw new BadRequestException("Token không hợp lệ hoặc đã được xác thực");

		user.is_active = true;
		user.email_verify_token = undefined;
		await user.save();

		return {
			message: "Tài khoản đã được xác thực thành công. Bạn có thể đăng nhập.",
		};
	}
}
