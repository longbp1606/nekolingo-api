import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import { ArchivementModel, UserArchivementModel } from "@db/models";
import { CreateArchivementRequest } from "./dto/create-archivement.request";
import { UpdateArchivementRequest } from "./dto/update-archivement.request";
import { ValidationError } from "class-validator";
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

	async getAllArchivements(): Promise<any[]> {
		return ArchivementModel.find().lean();
	}

	async updateArchivement(id: string, dto: UpdateArchivementRequest) {
		const updated = await ArchivementModel.findByIdAndUpdate(id, dto, {
			new: true,
		});
		if (!updated) {
			throw new NotFoundException("Archivement not found");
		}
		return updated;
	}

	async deleteArchivement(id: string) {
		const archivement = await ArchivementModel.findById(id);
		if (!archivement) {
			throw new NotFoundException("Archivement not found");
		}

		const isUsed = await UserArchivementModel.exists({ archivement_id: id });
		if (isUsed) {
			throw new BadRequestException(
				"Cannot delete archivement: already assigned to users",
			);
		}

		await ArchivementModel.findByIdAndDelete(id);
	}
}
