import { ImageModel } from "@db/models/image.model";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CloudinaryService } from "@providers/cloudinary";

@Injectable()
export class UploadService {
	constructor(private readonly cloudinaryService: CloudinaryService) {}

	async uploadImage(file: Express.Multer.File, folder?: string) {
		if (!file) {
			throw new BadRequestException("No file uploaded");
		}

		try {
			const result = await this.cloudinaryService.uploadImage(file, folder);

			// Save to MongoDB
			const imageDoc = new ImageModel({
				publicId: result.public_id,
				url: result.secure_url,
				originalName: result.display_name,
				folder: result.asset_folder,
				format: result.format,
				width: result.width,
				height: result.height,
				bytes: result.bytes,
			});

			const savedImage = await imageDoc.save();

			return {
				message: "Upload successful",
				image: savedImage,
			};
		} catch (error) {
			console.error(error);
			throw new BadRequestException("Upload failed");
		}
	}

	async deleteImage(publicId: string) {
		try {
			// Delete from Cloudinary
			await this.cloudinaryService.deleteImage(publicId);

			// Delete from MongoDB
			await ImageModel.findOneAndDelete({ publicId });

			return { message: "Image deleted successfully" };
		} catch (error) {
			throw new BadRequestException("Delete failed");
		}
	}
}
