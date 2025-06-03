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
} from "@nestjs/swagger";
import { LessonModel } from "@db/models";

@ApiTags("Lesson")
@Controller("lesson")
export class LessonController {
	constructor(private readonly svc: LessonService) {}

	@Post()
	@ApiOperation({ summary: "Tạo mới một bài học" })
	@ApiBody({ type: CreateLessonRequest })
	@ApiResponse({
		status: 201,
		description: "Bài học được tạo thành công",
		type: LessonModel,
	})
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
	async findAll(@Query("page") page: string, @Query("take") take: string) {
		const p = parseInt(page) > 0 ? parseInt(page) : 1;
		const t = parseInt(take) > 0 ? parseInt(take) : 10;
		return this.svc.getLessons(p, t);
	}

	@Get(":id")
	@ApiOperation({ summary: "Lấy chi tiết một bài học theo ID" })
	@ApiParam({ name: "id", description: "ID của bài học" })
	@ApiResponse({
		status: 200,
		description: "Trả về một bài học",
		type: LessonModel,
	})
	@ApiResponse({ status: 404, description: "Bài học không tìm thấy" })
	async findOne(@Param("id") id: string) {
		return this.svc.getLessonById(id);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Cập nhật một bài học theo ID" })
	@ApiParam({ name: "id", description: "ID của bài học" })
	@ApiBody({ type: UpdateLessonRequest })
	@ApiResponse({
		status: 200,
		description: "Cập nhật thành công",
		type: LessonModel,
	})
	@ApiResponse({ status: 400, description: "Lỗi validation" })
	@ApiResponse({ status: 404, description: "Bài học không tìm thấy" })
	async update(@Param("id") id: string, @Body() dto: UpdateLessonRequest) {
		return this.svc.updateLesson(id, dto);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Xóa một bài học theo ID" })
	@ApiParam({ name: "id", description: "ID của bài học" })
	@ApiResponse({
		status: 200,
		description: "Xóa thành công",
		schema: { example: { message: "Deleted successfully" } },
	})
	@ApiResponse({ status: 404, description: "Bài học không tìm thấy" })
	@HttpCode(HttpStatus.OK)
	async remove(@Param("id") id: string) {
		return this.svc.deleteLesson(id);
	}
}
