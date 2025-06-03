import { Injectable } from "@nestjs/common";
import { CreateUserArchivementRequest } from "./dto";
import { ValidationError } from "class-validator";
import { UserArchivementModel, UserModel, ArchivementModel } from "@db/models";
import { ApiValidationError } from "@errors";

@Injectable()
export class UserArchivementService {
	async validateBeforeCreate(dto: CreateUserArchivementRequest) {
		const errors: ValidationError[] = [];
		const [userExists, archivementExists, alreadyUnlocked] = await Promise.all([
			UserModel.exists({ _id: dto.user_id }),
			ArchivementModel.exists({ _id: dto.archivement_id }),
			UserArchivementModel.exists({
				user_id: dto.user_id,
				archivement_id: dto.archivement_id,
			}),
		]);

		if (!userExists) {
			errors.push({
				property: "user_id",
				constraints: {
					userNotFound: "User not found",
				},
			});
		}

		if (!archivementExists) {
			errors.push({
				property: "archivement_id",
				constraints: {
					archivementNotFound: "Archivement not found",
				},
			});
		}

		if (alreadyUnlocked) {
			errors.push({
				property: "user_id",
				constraints: {
					alreadyUnlocked: "User already unlocked this archivement",
				},
			});
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createUserArchivement(dto: CreateUserArchivementRequest) {
		await this.validateBeforeCreate(dto);
		const userArchivement = new UserArchivementModel({
			user_id: dto.user_id,
			archivement_id: dto.archivement_id,
			unlock_at: dto.unlock_at || new Date(),
		});
		await userArchivement.save();
		return userArchivement;
	}

	async getUserArchivements(userId: string) {
		return UserArchivementModel.find({ user_id: userId })
			.populate("archivement_id")
			.exec();
	}
}
