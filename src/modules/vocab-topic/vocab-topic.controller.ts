import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { VocabTopicService } from "./vocab-topic.service";
import {
	ApiResponseDto,
	SwaggerApiResponse,
	SwaggerApiMessageResponse,
} from "@utils";
import {
	CreateVocabTopicRequest,
	UpdateVocabTopicRequest,
	VocabTopicResponse,
} from "./dto";

@ApiTags("VocabTopic")
@ApiBearerAuth()
@Controller("vocab-topic")
export class VocabTopicController {
	constructor(private readonly vocabTopicService: VocabTopicService) {}

	@Post()
	@SwaggerApiResponse(VocabTopicResponse)
	async createVocabTopic(@Body() dto: CreateVocabTopicRequest) {
		const vocabTopic = await this.vocabTopicService.createVocabTopic(dto);
		return new ApiResponseDto(
			vocabTopic,
			null,
			"VocabTopic created successfully",
		);
	}

	@Get()
	@SwaggerApiResponse(VocabTopicResponse, {
		isArray: true,
		withPagination: true,
	})
	async getVocabTopics(
		@Query("page") page: number = 1,
		@Query("take") take: number = 10,
		@Query("topicId") topicId?: string,
	) {
		const { vocabTopics, pagination } =
			await this.vocabTopicService.getVocabTopics(page, take, topicId);
		return new ApiResponseDto(vocabTopics, pagination);
	}

	@Get("topic/:topicId")
	@SwaggerApiResponse(VocabTopicResponse, { isArray: true })
	async getVocabTopicsByTopic(@Param("topicId") topicId: string) {
		const vocabTopics =
			await this.vocabTopicService.getVocabTopicsByTopic(topicId);
		return new ApiResponseDto(vocabTopics);
	}

	@Get(":id")
	@SwaggerApiResponse(VocabTopicResponse)
	async getVocabTopicById(@Param("id") id: string) {
		const vocabTopic = await this.vocabTopicService.getVocabTopicById(id);
		return new ApiResponseDto(vocabTopic);
	}

	@Patch(":id")
	@SwaggerApiResponse(VocabTopicResponse)
	async updateVocabTopic(
		@Param("id") id: string,
		@Body() dto: UpdateVocabTopicRequest,
	) {
		const vocabTopic = await this.vocabTopicService.updateVocabTopic(id, dto);
		return new ApiResponseDto(
			vocabTopic,
			null,
			"VocabTopic updated successfully",
		);
	}

	@Delete(":id")
	@SwaggerApiMessageResponse()
	async deleteVocabTopic(@Param("id") id: string) {
		await this.vocabTopicService.deleteVocabTopic(id);
		return new ApiResponseDto(null, null, "VocabTopic deleted successfully");
	}
}
