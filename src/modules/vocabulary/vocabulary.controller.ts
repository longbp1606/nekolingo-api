import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { VocabularyService } from "./vocabulary.service";
import {
	ApiResponseDto,
	SwaggerApiResponse,
	SwaggerApiMessageResponse,
} from "@utils";
import {
	CreateVocabularyRequest,
	UpdateVocabularyRequest,
	VocabularyResponse,
} from "./dto";

@ApiTags("Vocabulary")
@ApiBearerAuth()
@Controller("vocabulary")
export class VocabularyController {
	constructor(private readonly vocabularyService: VocabularyService) {}

	@Post()
	@SwaggerApiResponse(VocabularyResponse)
	async createVocabulary(@Body() dto: CreateVocabularyRequest) {
		const vocabulary = await this.vocabularyService.createVocabulary(dto);
		return new ApiResponseDto(
			vocabulary,
			null,
			"Vocabulary created successfully",
		);
	}

	@Get()
	@SwaggerApiResponse(VocabularyResponse, {
		isArray: true,
		withPagination: true,
	})
	async getVocabularies(
		@Query("page") page: number = 1,
		@Query("take") take: number = 10,
	) {
		const { vocabularies, pagination } =
			await this.vocabularyService.getVocabularies(page, take);
		return new ApiResponseDto(vocabularies, pagination);
	}

	@Get(":id")
	@SwaggerApiResponse(VocabularyResponse)
	async getVocabularyById(@Param("id") id: string) {
		const vocabulary = await this.vocabularyService.getVocabularyById(id);
		return new ApiResponseDto(vocabulary);
	}

	@Put(":id")
	@SwaggerApiResponse(VocabularyResponse)
	async updateVocabulary(
		@Param("id") id: string,
		@Body() dto: UpdateVocabularyRequest,
	) {
		const vocabulary = await this.vocabularyService.updateVocabulary(id, dto);
		return new ApiResponseDto(
			vocabulary,
			null,
			"Vocabulary updated successfully",
		);
	}

	@Delete(":id")
	@SwaggerApiMessageResponse()
	async deleteVocabulary(@Param("id") id: string) {
		await this.vocabularyService.deleteVocabulary(id);
		return new ApiResponseDto(null, null, "Vocabulary deleted successfully");
	}
}
