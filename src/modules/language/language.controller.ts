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
import { LanguageService } from "./language.service";
import { CreateLanguageRequest, UpdateLanguageRequest } from "./dto";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiQuery,
	ApiParam,
	ApiBody,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { LanguageModel } from "@db/models";

@ApiTags("Language")
@ApiBearerAuth()
@Controller("language")
export class LanguageController {
	constructor(private readonly svc: LanguageService) {}

	@Post()
	@ApiOperation({ summary: "Tạo mới một ngôn ngữ" })
	@ApiBody({ type: CreateLanguageRequest })
	@ApiResponse({
		status: 201,
		description: "Ngôn ngữ được tạo thành công",
		type: LanguageModel,
	})
	@ApiResponse({ status: 400, description: "Lỗi validation" })
	async create(@Body() dto: CreateLanguageRequest) {
		return this.svc.createLanguage(dto);
	}

	@Get()
	@ApiOperation({ summary: "Lấy danh sách ngôn ngữ (có phân trang)" })
	@ApiQuery({ name: "page", required: false, example: 1 })
	@ApiQuery({ name: "take", required: false, example: 10 })
	@ApiResponse({
		status: 200,
		description: "Trả về danh sách ngôn ngữ",
		schema: {
			properties: {
				languages: {
					type: "array",
					items: { $ref: "#/components/schemas/Language" },
				},
				pagination: { $ref: "#/components/schemas/PaginationDto" },
			},
		},
	})
	async findAll(@Query("page") page: string, @Query("take") take: string) {
		const p = parseInt(page) > 0 ? parseInt(page) : 1;
		const t = parseInt(take) > 0 ? parseInt(take) : 10;
		return this.svc.getLanguages(p, t);
	}

	@Get(":id")
	@ApiOperation({ summary: "Lấy chi tiết một ngôn ngữ theo ID" })
	@ApiParam({ name: "id", description: "ID của ngôn ngữ" })
	@ApiResponse({
		status: 200,
		description: "Trả về một ngôn ngữ",
		type: LanguageModel,
	})
	@ApiResponse({ status: 404, description: "Ngôn ngữ không tìm thấy" })
	async findOne(@Param("id") id: string) {
		return this.svc.getLanguageById(id);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Cập nhật một ngôn ngữ theo ID" })
	@ApiParam({ name: "id", description: "ID của ngôn ngữ" })
	@ApiBody({ type: UpdateLanguageRequest })
	@ApiResponse({
		status: 200,
		description: "Cập nhật thành công",
		type: LanguageModel,
	})
	@ApiResponse({ status: 400, description: "Lỗi validation" })
	@ApiResponse({ status: 404, description: "Ngôn ngữ không tìm thấy" })
	async update(@Param("id") id: string, @Body() dto: UpdateLanguageRequest) {
		return this.svc.updateLanguage(id, dto);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Xóa một ngôn ngữ theo ID" })
	@ApiParam({ name: "id", description: "ID của ngôn ngữ" })
	@ApiResponse({
		status: 200,
		description: "Xóa thành công",
		schema: { example: { message: "Deleted successfully" } },
	})
	@ApiResponse({ status: 404, description: "Ngôn ngữ không tìm thấy" })
	@HttpCode(HttpStatus.OK)
	async remove(@Param("id") id: string) {
		return this.svc.deleteLanguage(id);
	}
}
