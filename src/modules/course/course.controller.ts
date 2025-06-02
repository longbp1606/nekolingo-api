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
import { CourseService } from "./course.service";
import { CreateCourseRequest, UpdateCourseRequest } from "./dto";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiQuery,
	ApiParam,
	ApiBody,
} from "@nestjs/swagger";
import { CourseModel } from "@db/models";

@ApiTags("Course")
@Controller("course")
export class CourseController {
	constructor(private readonly svc: CourseService) {}

	@Post()
	@ApiOperation({ summary: "Tạo mới một khóa học" })
	@ApiBody({ type: CreateCourseRequest })
	@ApiResponse({
		status: 201,
		description: "Khóa học được tạo thành công",
		type: CourseModel,
	})
	@ApiResponse({ status: 400, description: "Lỗi validation" })
	async create(@Body() dto: CreateCourseRequest) {
		return this.svc.createCourse(dto);
	}

	@Get()
	@ApiOperation({ summary: "Lấy danh sách khóa học (có phân trang)" })
	@ApiQuery({ name: "page", required: false, example: 1 })
	@ApiQuery({ name: "take", required: false, example: 10 })
	@ApiResponse({
		status: 200,
		description: "Trả về danh sách khóa học",
		schema: {
			properties: {
				courses: {
					type: "array",
					items: { $ref: "#/components/schemas/Course" },
				},
				pagination: { $ref: "#/components/schemas/PaginationDto" },
			},
		},
	})
	async findAll(@Query("page") page: string, @Query("take") take: string) {
		const p = parseInt(page) > 0 ? parseInt(page) : 1;
		const t = parseInt(take) > 0 ? parseInt(take) : 10;
		return this.svc.getCourses(p, t);
	}

	@Get(":id")
	@ApiOperation({ summary: "Lấy chi tiết một khóa học theo ID" })
	@ApiParam({ name: "id", description: "ID của khóa học" })
	@ApiResponse({
		status: 200,
		description: "Trả về một khóa học",
		type: CourseModel,
	})
	@ApiResponse({ status: 404, description: "Khóa học không tìm thấy" })
	async findOne(@Param("id") id: string) {
		return this.svc.getCourseById(id);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Cập nhật một khóa học theo ID" })
	@ApiParam({ name: "id", description: "ID của khóa học" })
	@ApiBody({ type: UpdateCourseRequest })
	@ApiResponse({
		status: 200,
		description: "Cập nhật thành công",
		type: CourseModel,
	})
	@ApiResponse({ status: 400, description: "Lỗi validation" })
	@ApiResponse({ status: 404, description: "Khóa học không tìm thấy" })
	async update(@Param("id") id: string, @Body() dto: UpdateCourseRequest) {
		return this.svc.updateCourse(id, dto);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Xóa một khóa học theo ID" })
	@ApiParam({ name: "id", description: "ID của khóa học" })
	@ApiResponse({
		status: 200,
		description: "Xóa thành công",
		schema: { example: { message: "Deleted successfully" } },
	})
	@ApiResponse({ status: 404, description: "Khóa học không tìm thấy" })
	@HttpCode(HttpStatus.OK)
	async remove(@Param("id") id: string) {
		return this.svc.deleteCourse(id);
	}
}
