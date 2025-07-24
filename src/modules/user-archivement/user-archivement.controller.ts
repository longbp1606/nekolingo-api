import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserArchivementService } from "./user-archivement.service";
import { ApiResponseDto, SwaggerApiResponse } from "@utils";
import { CreateUserArchivementRequest } from "./dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("User Archivement")
@ApiBearerAuth()
@Controller("user-archivement")
export class UserArchivementController {
	constructor(
		private readonly userArchivementService: UserArchivementService,
	) {}

	@Post()
	@SwaggerApiResponse(Object)
	async createUserArchivement(@Body() dto: CreateUserArchivementRequest) {
		const userArchivement =
			await this.userArchivementService.createUserArchivement(dto);
		return new ApiResponseDto(
			userArchivement,
			null,
			"User archivement created successfully",
		);
	}

	@Get(":userId")
	@SwaggerApiResponse(Object)
	async getUserArchivements(@Param("userId") userId: string) {
		const userArchivements =
			await this.userArchivementService.getUserArchivements(userId);
		return new ApiResponseDto(
			userArchivements,
			null,
			"User archivements retrieved successfully",
		);
	}
}
