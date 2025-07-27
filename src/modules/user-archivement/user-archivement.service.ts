import { Injectable } from "@nestjs/common";
import { CreateUserArchivementRequest } from "./dto";
import { ValidationError } from "class-validator";
import { UserArchivementModel, UserModel, ArchivementModel } from "@db/models";
import { ApiValidationError } from "@errors";
import { archivementHandlers } from "src/utils/archivement.util";
import { ArchivementCondition } from "src/utils/types";

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
		const user = await UserModel.findById(userId);
		if (!user) return [];

		const archivements = await ArchivementModel.find().lean();
		const userArchivements = await UserArchivementModel.find({
			user_id: userId,
		}).lean();

		const unlockedMap = new Map(
			userArchivements.map((ua) => [ua.archivement_id.toString(), ua]),
		);

		return await Promise.all(
			archivements.map(async (arch) => {
				const condition = arch.condition as unknown as ArchivementCondition;
				const handler = archivementHandlers[condition.type];
				const current = handler ? await handler(user, condition) : 0;
				const target = condition.value ?? 1;

				let unlocked: any = unlockedMap.get(arch._id.toString());

				if (!unlocked && current >= target) {
					await this.createUserArchivement({
						user_id: user._id.toString(),
						archivement_id: arch._id.toString(),
						unlock_at: new Date(),
					});

					unlocked = { unlock_at: new Date() };
				}

				return {
					...arch,
					progress: current,
					progress_text: `${current}/${target}`,
					is_unlocked: !!unlocked,
					unlock_at: unlocked?.unlock_at || null,
				};
			}),
		);
	}
}
