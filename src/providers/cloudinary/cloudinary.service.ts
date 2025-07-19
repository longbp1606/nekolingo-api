import { ImageModel } from "@db/models/image.model";
import { Injectable, Inject } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
	constructor(@Inject("CLOUDINARY") private cloudinary) {}

	async uploadImage(
		file: Express.Multer.File,
		folder?: string,
	): Promise<UploadApiResponse | UploadApiErrorResponse> {
		return new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "auto",
						folder: folder || "uploads",
						quality: "auto",
						fetch_format: "auto",
					},
					async (error, result) => {
						if (error) reject(error);
						else {
							resolve(result);
						}
					},
				)
				.end(file.buffer);
		});
	}

	async deleteImage(publicId: string): Promise<any> {
		return new Promise((resolve, reject) => {
			cloudinary.uploader.destroy(publicId, async (error, result) => {
				if (error) reject(error);
				else {
					resolve(result);
				}
			});
		});
	}

	getOptimizedUrl(publicId: string, options?: any): string {
		return cloudinary.url(publicId, {
			quality: "auto",
			fetch_format: "auto",
			...options,
		});
	}
}
