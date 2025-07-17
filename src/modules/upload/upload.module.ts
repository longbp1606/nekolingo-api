import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { CloudinaryModule, CloudinaryService } from "@providers/cloudinary";

@Module({
	imports: [CloudinaryModule],
	providers: [UploadService],
	controllers: [UploadController],
	exports: [UploadService],
})
export class UploadModule {}
