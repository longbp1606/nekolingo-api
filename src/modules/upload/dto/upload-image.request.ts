import { ApiProperty } from "@nestjs/swagger";

export class UploadImageRequest {
	@ApiProperty({
		type: "string",
		format: "binary",
		description: "Image file to upload",
	})
	file: Express.Multer.File;

	@ApiProperty({
		required: false,
		description: "Folder name to organize uploads",
		example: "profile-pictures",
	})
	folder?: string;
}
