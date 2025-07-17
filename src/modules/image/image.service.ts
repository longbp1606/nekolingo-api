import { ImageModel } from "@db/models/image.model";
import { GetImageListRequest } from "./dto/get-list.request";
import { PaginationDto } from "@utils";

export class ImageService {
	async getImageList(dto: GetImageListRequest) {
		const skip = (dto.page - 1) * dto.take;

		const [images, total] = await Promise.all([
			ImageModel.find().skip(skip).limit(dto.take).exec(),
			ImageModel.countDocuments(),
		]);

		return {
			images,
			pagination: new PaginationDto(dto.page, dto.take, total),
		};
	}
}
