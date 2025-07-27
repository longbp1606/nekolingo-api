import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ArchivementService } from "./archivement.service";
import { ApiResponseDto, SwaggerApiResponse } from "@utils";
import { CreateArchivementRequest } from "./dto/create-archivement.request";
import { UpdateArchivementRequest } from "./dto/update-archivement.request";
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

	@Patch(":id")
	@SwaggerApiResponse(Object)
	async updateArchivement(
		@Param("id") id: string,
		@Body() dto: UpdateArchivementRequest,
	) {
		const updated = await this.archivementService.updateArchivement(id, dto);
		return new ApiResponseDto(
			updated,
			null,
			"Archivement updated successfully",
		);
	}

	@Delete(":id")
	@SwaggerApiResponse(Object)
	async deleteArchivement(@Param("id") id: string) {
		await this.archivementService.deleteArchivement(id);
		return new ApiResponseDto(null, null, "Archivement deleted successfully");
	}
}
