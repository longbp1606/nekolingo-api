import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	HttpCode,
	HttpStatus,
} from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { CreateLessonRequest, UpdateLessonRequest } from "./dto";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiQuery,
	ApiParam,
	ApiBody,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { LessonModel } from "@db/models";

@ApiTags("Lesson")
@ApiBearerAuth()
@Controller("lesson")
export class LessonController {
	constructor(private readonly svc: LessonService) {}

	@Post()
	@ApiOperation({ summary: "Tạo mới một bài học" })
	@ApiBody({ type: CreateLessonRequest })
	@ApiResponse({ status: 201, type: LessonModel })
	@ApiResponse({ status: 400, description: "Lỗi validation" })
	async create(@Body() dto: CreateLessonRequest) {
		return this.svc.createLesson(dto);
	}

	@Get()
	@ApiOperation({ summary: "Lấy danh sách bài học (có phân trang)" })
	@ApiQuery({ name: "page", required: false, example: 1 })
	@ApiQuery({ name: "take", required: false, example: 10 })
	@ApiResponse({
		status: 200,
		description: "Trả về danh sách bài học",
		schema: {
			properties: {
				lessons: {
					type: "array",
					items: { $ref: "#/components/schemas/Lesson" },
				},
				pagination: { $ref: "#/components/schemas/PaginationDto" },
			},
		},
	})
	async findAll(@Query("page") page = "1", @Query("take") take = "10") {
		const p = Math.max(1, parseInt(page, 10));
		const t = Math.max(1, parseInt(take, 10));
		return this.svc.getLessons(p, t);
	}

	@Get("/topic/:topicId")
	@ApiOperation({ summary: "Lấy danh sách bài học theo chủ đề" })
	@ApiParam({ name: "topicId", description: "ID của chủ đề" })
	@ApiResponse({
		status: 200,
		description: "Trả về danh sách bài học theo chủ đề",
		type: [LessonModel],
	})
	async findByTopic(@Param("topicId") topicId: string) {
		return this.svc.getLessonsByTopic(topicId);
	}

	@Get(":id")
	@ApiOperation({ summary: "Lấy chi tiết một bài học theo ID" })
	@ApiParam({ name: "id", description: "ID của bài học" })
	@ApiResponse({ status: 200, type: LessonModel })
	@ApiResponse({ status: 404, description: "Không tìm thấy bài học" })
	async findOne(@Param("id") id: string) {
		return this.svc.getLessonById(id);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Cập nhật bài học theo ID" })
	@ApiParam({ name: "id", description: "ID của bài học" })
	@ApiBody({ type: UpdateLessonRequest })
	@ApiResponse({ status: 200, type: LessonModel })
	@ApiResponse({ status: 400, description: "Lỗi validation" })
	@ApiResponse({ status: 404, description: "Không tìm thấy bài học" })
	async update(@Param("id") id: string, @Body() dto: UpdateLessonRequest) {
		return this.svc.updateLesson(id, dto);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Xóa bài học theo ID" })
	@ApiParam({ name: "id", description: "ID của bài học" })
	@ApiResponse({
		status: 200,
		schema: { example: { message: "Deleted successfully" } },
	})
	@ApiResponse({ status: 404, description: "Không tìm thấy bài học" })
	@HttpCode(HttpStatus.OK)
	async remove(@Param("id") id: string) {
		return this.svc.deleteLesson(id);
	}
}
