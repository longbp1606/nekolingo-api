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
import { ExerciseService } from "./exercise.service";
import { CreateExerciseRequest, UpdateExerciseRequest } from "./dto";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiQuery,
	ApiParam,
	ApiBody,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { ExerciseModel } from "@db/models";

@ApiTags("Exercise")
@ApiBearerAuth()
@Controller("exercise")
export class ExerciseController {
	constructor(private readonly svc: ExerciseService) {}

	@Post()
	@ApiOperation({ summary: "Tạo mới một bài tập" })
	@ApiBody({ type: CreateExerciseRequest })
	@ApiResponse({
		status: 201,
		description: "Bài tập được tạo thành công",
		type: ExerciseModel,
	})
	@ApiResponse({ status: 400, description: "Lỗi validation" })
	async create(@Body() dto: CreateExerciseRequest) {
		return this.svc.createExercise(dto);
	}

	@Get()
	@ApiOperation({ summary: "Lấy danh sách bài tập (có phân trang)" })
	@ApiQuery({ name: "page", required: false, example: 1 })
	@ApiQuery({ name: "take", required: false, example: 10 })
	@ApiResponse({
		status: 200,
		description: "Trả về danh sách bài tập",
		schema: {
			properties: {
				exercises: {
					type: "array",
					items: { $ref: "#/components/schemas/Exercise" },
				},
				pagination: { $ref: "#/components/schemas/PaginationDto" },
			},
		},
	})
	async findAll(@Query("page") page: string, @Query("take") take: string) {
		const p = parseInt(page) > 0 ? parseInt(page) : 1;
		const t = parseInt(take) > 0 ? parseInt(take) : 10;
		return this.svc.getExercises(p, t);
	}

	@Get(":id")
	@ApiOperation({ summary: "Lấy chi tiết một bài tập theo ID" })
	@ApiParam({ name: "id", description: "ID của bài tập" })
	@ApiResponse({
		status: 200,
		description: "Trả về một bài tập",
		type: ExerciseModel,
	})
	@ApiResponse({ status: 404, description: "Bài tập không tìm thấy" })
	async findOne(@Param("id") id: string) {
		return this.svc.getExerciseById(id);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Cập nhật một bài tập theo ID" })
	@ApiParam({ name: "id", description: "ID của bài tập" })
	@ApiBody({ type: UpdateExerciseRequest })
	@ApiResponse({
		status: 200,
		description: "Cập nhật thành công",
		type: ExerciseModel,
	})
	@ApiResponse({ status: 400, description: "Lỗi validation" })
	@ApiResponse({ status: 404, description: "Bài tập không tìm thấy" })
	async update(@Param("id") id: string, @Body() dto: UpdateExerciseRequest) {
		return this.svc.updateExercise(id, dto);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Xóa một bài tập theo ID" })
	@ApiParam({ name: "id", description: "ID của bài tập" })
	@ApiResponse({
		status: 200,
		description: "Xóa thành công",
		schema: { example: { message: "Deleted successfully" } },
	})
	@ApiResponse({ status: 404, description: "Bài tập không tìm thấy" })
	@HttpCode(HttpStatus.OK)
	async remove(@Param("id") id: string) {
		return this.svc.deleteExercise(id);
	}
}
