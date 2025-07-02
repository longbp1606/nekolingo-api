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
import { TopicService } from "./topic.service";
import {
	ApiResponseDto,
	SwaggerApiResponse,
	SwaggerApiMessageResponse,
} from "@utils";
import { CreateTopicRequest, UpdateTopicRequest, TopicResponse } from "./dto";

@ApiTags("Topic")
@ApiBearerAuth()
@Controller("topic")
export class TopicController {
	constructor(private readonly topicService: TopicService) {}

	@Post()
	@SwaggerApiResponse(TopicResponse)
	async createTopic(@Body() dto: CreateTopicRequest) {
		const topic = await this.topicService.createTopic(dto);
		return new ApiResponseDto(topic, null, "Topic created successfully");
	}
	@Get("listTopics")
	@SwaggerApiResponse(TopicResponse, { isArray: true })
	async listAllTopics() {
		const topics = await this.topicService.listAllTopics();
		return new ApiResponseDto(topics);
	}
	@Get()
	@SwaggerApiResponse(TopicResponse, { isArray: true, withPagination: true })
	async getTopics(
		@Query("page") page: number = 1,
		@Query("take") take: number = 10,
		@Query("courseId") courseId?: string,
	) {
		const { topics, pagination } = await this.topicService.getTopics(
			page,
			take,
			courseId,
		);
		return new ApiResponseDto(topics, pagination);
	}

	@Get("course/:courseId")
	@SwaggerApiResponse(TopicResponse, { isArray: true })
	async getTopicsByCourse(@Param("courseId") courseId: string) {
		const topics = await this.topicService.getTopicsByCourse(courseId);
		return new ApiResponseDto(topics);
	}

	@Get(":id")
	@SwaggerApiResponse(TopicResponse)
	async getTopicById(@Param("id") id: string) {
		const topic = await this.topicService.getTopicById(id);
		return new ApiResponseDto(topic);
	}

	@Patch(":id")
	@SwaggerApiResponse(TopicResponse)
	async updateTopic(@Param("id") id: string, @Body() dto: UpdateTopicRequest) {
		const topic = await this.topicService.updateTopic(id, dto);
		return new ApiResponseDto(topic, null, "Topic updated successfully");
	}

	@Delete(":id")
	@SwaggerApiMessageResponse()
	async deleteTopic(@Param("id") id: string) {
		await this.topicService.deleteTopic(id);
		return new ApiResponseDto(null, null, "Topic deleted successfully");
	}
}
