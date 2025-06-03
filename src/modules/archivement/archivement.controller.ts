import { Body, Controller, Post } from "@nestjs/common";
import { ArchivementService } from "./archivement.service";
import { ApiResponseDto, SwaggerApiResponse } from "@utils";
import { CreateArchivementRequest } from "./dto";

@Controller("archivement")
export class ArchivementController {
	constructor(private readonly archivementService: ArchivementService) {}

	@Post()
	@SwaggerApiResponse(Object)
	async createArchivement(@Body() dto: CreateArchivementRequest) {
		await this.archivementService.createArchivement(dto);
		return new ApiResponseDto(null, null, "Archivement created successfully");
	}
}
