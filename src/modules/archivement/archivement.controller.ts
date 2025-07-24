import { Body, Controller, Get, Post } from "@nestjs/common";
import { ArchivementService } from "./archivement.service";
import { ApiResponseDto, SwaggerApiResponse } from "@utils";
import { CreateArchivementRequest } from "./dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Archivement")
@ApiBearerAuth()
@Controller("archivement")
export class ArchivementController {
	constructor(private readonly archivementService: ArchivementService) {}

	@Post()
	@SwaggerApiResponse(Object)
	async createArchivement(@Body() dto: CreateArchivementRequest) {
		await this.archivementService.createArchivement(dto);
		return new ApiResponseDto(null, null, "Archivement created successfully");
	}
	@Get("list")
	@SwaggerApiResponse(Object, { isArray: true })
	async getAllArchivementsForAdmin() {
		const archivements = await this.archivementService.getAllArchivements();
		return new ApiResponseDto(archivements);
	}
}
