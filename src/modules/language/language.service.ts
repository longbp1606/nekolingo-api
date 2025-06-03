import { Injectable, NotFoundException } from "@nestjs/common";
import { LanguageModel } from "@db/models";
import { CreateLanguageRequest, UpdateLanguageRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ValidationError } from "class-validator";
import { ApiValidationError } from "@errors";
import { Types } from "mongoose";
import { CourseModel } from "@db/models";
@Injectable()
export class LanguageService {
	private async validateBeforeCreate(dto: CreateLanguageRequest) {
		const errors: ValidationError[] = [];
		const exists = await LanguageModel.exists({ code: dto.code });
		if (exists) {
			errors.push({
				property: "code",
				constraints: { unique: "Language code already exists" },
			} as ValidationError);
		}
		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createLanguage(dto: CreateLanguageRequest) {
		await this.validateBeforeCreate(dto);
		const lang = new LanguageModel(dto);
		return await lang.save();
	}

	async getLanguages(page: number = 1, take: number = 10) {
		const skip = (page - 1) * take;
		const [languages, total] = await Promise.all([
			LanguageModel.find().skip(skip).limit(take).exec(),
			LanguageModel.countDocuments().exec(),
		]);
		const pagination = new PaginationDto(page, take, total);
		return { languages, pagination };
	}

	async getLanguageById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}
		const lang = await LanguageModel.findById(id).exec();
		if (!lang) {
			throw new NotFoundException(`Language with ID ${id} not found`);
		}
		return lang;
	}

	async updateLanguage(id: string, dto: UpdateLanguageRequest) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}
		if (dto.code) {
			const exists = await LanguageModel.exists({
				code: dto.code,
				_id: { $ne: id },
			});
			if (exists) {
				throw new ApiValidationError([
					{
						property: "code",
						constraints: { unique: "Language code already exists" },
					} as ValidationError,
				]);
			}
		}
		const updated = await LanguageModel.findByIdAndUpdate(id, dto, {
			new: true,
		}).exec();
		if (!updated) {
			throw new NotFoundException(`Language with ID ${id} not found`);
		}
		return updated;
	}

	async deleteLanguage(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		const usedInCourse = await CourseModel.exists({
			$or: [{ language_from: id }, { language_to: id }],
		});

		if (usedInCourse) {
			throw new ApiValidationError([
				{
					property: "language",
					constraints: {
						inUse: "Language is in use in Course and cannot be deleted",
					},
				} as ValidationError,
			]);
		}

		const deleted = await LanguageModel.findByIdAndDelete(id).exec();
		if (!deleted) {
			throw new NotFoundException(`Language with ID ${id} not found`);
		}

		return { message: "Deleted successfully" };
	}
}
