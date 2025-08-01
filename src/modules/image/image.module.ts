import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";

@Module({
	providers: [ImageService],
	exports: [ImageService],
	controllers: [ImageController],
})
export class ImageModule {}
