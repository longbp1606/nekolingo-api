import { Controller, Get, Query } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { ImageService } from "./image.service";
import { GetImageListRequest } from "./dto/get-list.request";

@ApiTags("Image")
@ApiBearerAuth()
@Controller("image")
export class ImageController {
	constructor(private readonly imageService: ImageService) {}

	@Get()
	@ApiOperation({ summary: "Lấy danh sách ảnh" })
	@ApiQuery({ name: "page", required: false, example: 1 })
	@ApiQuery({ name: "take", required: false, example: 10 })
	@ApiResponse({ status: 200, description: "Lấy danh sách ảnh thành công" })
	async getList(@Query("page") page: number, @Query("take") take: number) {
		const dto = new GetImageListRequest(page, take);
		return this.imageService.getImageList(dto);
	}
}
