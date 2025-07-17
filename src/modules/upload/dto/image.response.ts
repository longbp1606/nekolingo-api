import { ApiProperty } from "@nestjs/swagger";

export class ImageResponse {
	@ApiProperty({ example: "uploads/image123" })
	publicId: string;

	@ApiProperty({
		example:
			"https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg",
	})
	url: string;

	@ApiProperty({ example: "profile-image.jpg" })
	originalName: string;

	@ApiProperty({ example: "uploads" })
	folder: string;

	@ApiProperty({ example: "jpg" })
	format: string;

	@ApiProperty({ example: 1920 })
	width: number;

	@ApiProperty({ example: 1080 })
	height: number;

	@ApiProperty({ example: 245760 })
	bytes: number;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
