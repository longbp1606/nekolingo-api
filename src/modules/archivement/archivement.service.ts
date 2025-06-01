import { Injectable } from "@nestjs/common";
import { CreateArchivementRequest } from "./dto";
import { ValidationError } from "class-validator";
import { ArchivementModel } from "@db/models";
import { ApiValidationError } from "@errors";

@Injectable()
export class ArchivementService {
	async validateBeforeCreate(dto: CreateArchivementRequest) {
		const errors: ValidationError[] = [];
		const [titleExisted] = await Promise.all([
			ArchivementModel.exists({ title: dto.title }),
		]);

		if (titleExisted) {
			errors.push({
				property: "title",
				constraints: {
					titleExisted: "Title already existed",
				},
			});
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createArchivement(dto: CreateArchivementRequest) {
		await this.validateBeforeCreate(dto);
		const archivement = new ArchivementModel(dto);
		await archivement.save();
	}
}
