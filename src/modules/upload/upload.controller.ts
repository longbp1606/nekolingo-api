import { SkipAuth } from "@modules/auth";
import {
	Body,
	Controller,
	Delete,
	Param,
	Post,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { CloudinaryService } from "@providers/cloudinary";
import { UploadImageRequest } from "./dto/upload-image.request";
import { ApiResponseDto } from "@utils";
import { UploadService } from "./upload.service";

@ApiTags("Upload")
@ApiBearerAuth()
@Controller("upload")
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post("image")
	@ApiOperation({ summary: "Tải ảnh lên cloud" })
	@UseInterceptors(FileInterceptor("file"))
	@ApiConsumes("multipart/form-data")
	@SkipAuth()
	@ApiBody({
		description: "Tải ảnh lên",
		type: UploadImageRequest,
	})
	async uploadImage(
		@UploadedFile() file: Express.Multer.File,
		@Body("folder") folder?: string,
	) {
		return this.uploadService.uploadImage(file, folder);
	}

	@Delete("image/:public_id")
	@ApiOperation({ summary: "Xóa ảnh trên cloud" })
	async deleteImage(@Param("public_id") publicId: string) {
		await this.uploadService.deleteImage(publicId);
		return new ApiResponseDto(null, null, "Xóa ảnh thành công");
	}
}
