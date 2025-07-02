import { Body, Controller, Get, Post } from "@nestjs/common";
import { SkipAuth } from "./skip-auth.decorator";
import { ApiResponseDto, SwaggerApiResponse } from "@utils";
import { BasicLoginRequest, BasicRegisterRequest, TokenResponse } from "./dto";
import { AuthService } from "./auth.service";
import { UserResponse } from "@modules/user/dto";
import { ApiBearerAuth } from "@nestjs/swagger";

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
	@SwaggerApiResponse(TokenResponse)
	async register(@Body() dto: BasicRegisterRequest) {
		await this.authService.basicRegister(dto);
		return new ApiResponseDto(null, null, "Register successfully!");
	}

	@Get("profile")
	@SwaggerApiResponse(UserResponse)
	@ApiBearerAuth()
	async getProfile() {
		const data = this.authService.getProfileCls();
		console.log(data); // TODO: remove thi
		return new ApiResponseDto(data, null, "Get profile successfully!");
	}
}
