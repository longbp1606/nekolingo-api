import { Body, Controller, Post } from "@nestjs/common";
import { SkipAuth } from "./skip-auth.decorator";
import { ApiResponseDto, SwaggerApiResponse } from "@utils";
import { BasicLoginRequest, BasicRegisterRequest, TokenResponse } from "./dto";
import { AuthService } from "./auth.service";

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
}
