import { Injectable } from "@nestjs/common";
import { isValidObjectId } from "mongoose";
import { VocabularyModel, LanguageModel, ExerciseModel } from "@db/models";
import { CreateVocabularyRequest, UpdateVocabularyRequest } from "./dto";
import { ApiValidationError, ApiError } from "@errors";
import { ValidationError } from "class-validator";
import { PaginationDto } from "@utils";

@Injectable()
export class VocabularyService {
	async validateBeforeCreate(dto: CreateVocabularyRequest) {
		const errors: ValidationError[] = [];

		if (dto.language_from === dto.language_to) {
			errors.push({
				property: "language_to",
				constraints: {
					conflict: "Source and target languages must not be the same.",
				},
			} as ValidationError);
		}

		const fromExists = await LanguageModel.exists({ _id: dto.language_from });
		if (!fromExists) {
			errors.push({
				property: "language_from",
				constraints: { exists: "Source language does not exist." },
			} as ValidationError);
		}

		const toExists = await LanguageModel.exists({ _id: dto.language_to });
		if (!toExists) {
			errors.push({
				property: "language_to",
				constraints: { exists: "Target language does not exist." },
			} as ValidationError);
		}

		const exists = await VocabularyModel.exists({
			word: dto.word,
			language_from: dto.language_from,
			language_to: dto.language_to,
		});
		if (exists) {
			errors.push({
				property: "word",
				constraints: {
					wordExists:
						"This vocabulary already exists for the selected language pair.",
				},
			} as ValidationError);
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createVocabulary(dto: CreateVocabularyRequest) {
		await this.validateBeforeCreate(dto);
		const vocabulary = new VocabularyModel(dto);
		return await vocabulary.save();
	}

	async getVocabularies(page = 1, take = 10) {
		const skip = (page - 1) * take;
		const [vocabularies, total] = await Promise.all([
			VocabularyModel.find()
				.populate("language_from language_to")
				.skip(skip)
				.limit(take)
				.exec(),
			VocabularyModel.countDocuments(),
		]);

		const pagination = new PaginationDto(page, take, total);
		return { vocabularies, pagination };
	}

	async getVocabularyById(id: string) {
		if (!isValidObjectId(id)) {
			throw new ApiError({
				code: "invalid_id",
				message: "Invalid vocabulary ID.",
				detail: null,
				status: 400,
			});
		}

		const vocabulary = await VocabularyModel.findById(id).populate(
			"language_from language_to",
		);
		if (!vocabulary) {
			throw new ApiError({
				code: "not_found",
				message: "Vocabulary not found.",
				detail: null,
				status: 404,
			});
		}

		return vocabulary;
	}

	async updateVocabulary(id: string, dto: UpdateVocabularyRequest) {
		if (!isValidObjectId(id)) {
			throw new ApiError({
				code: "invalid_id",
				message: "Invalid vocabulary ID.",
				detail: null,
				status: 400,
			});
		}

		const current = await VocabularyModel.findById(id);
		if (!current) {
			throw new ApiError({
				code: "not_found",
				message: "Vocabulary not found.",
				detail: null,
				status: 404,
			});
		}

		const errors: ValidationError[] = [];

		const language_from = dto.language_from ?? current.language_from.toString();
		const language_to = dto.language_to ?? current.language_to.toString();

		if (language_from === language_to) {
			errors.push({
				property: "language_to",
				constraints: {
					conflict: "Source and target languages must not be the same.",
				},
			} as ValidationError);
		}

		if (dto.language_from) {
			const fromExists = await LanguageModel.exists({ _id: dto.language_from });
			if (!fromExists) {
				errors.push({
					property: "language_from",
					constraints: { exists: "Source language does not exist." },
				} as ValidationError);
			}
		}

		if (dto.language_to) {
			const toExists = await LanguageModel.exists({ _id: dto.language_to });
			if (!toExists) {
				errors.push({
					property: "language_to",
					constraints: { exists: "Target language does not exist." },
				} as ValidationError);
			}
		}

		if (dto.word || dto.language_from || dto.language_to) {
			const exists = await VocabularyModel.exists({
				_id: { $ne: id },
				word: dto.word ?? current.word,
				language_from,
				language_to,
			});
			if (exists) {
				errors.push({
					property: "word",
					constraints: {
						wordExists:
							"This vocabulary already exists for the selected language pair.",
					},
				} as ValidationError);
			}
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}

		const vocabulary = await VocabularyModel.findByIdAndUpdate(id, dto, {
			new: true,
		})
			.populate("language_from", "name")
			.populate("language_to", "name");

		return vocabulary;
	}

	async validateBeforeDelete(id: string) {
		const referencedExercises = await ExerciseModel.countDocuments({
			vocabulary_id: id,
		});

		if (referencedExercises > 0) {
			throw new ApiError({
				code: "conflict",
				message: `Cannot delete this vocabulary. It is referenced by ${referencedExercises} exercise(s). Please remove those references first.`,
				detail: { references: referencedExercises },
				status: 409,
			});
		}
	}

	async deleteVocabulary(id: string) {
		if (!isValidObjectId(id)) {
			throw new ApiError({
				code: "invalid_id",
				message: "Invalid vocabulary ID.",
				detail: null,
				status: 400,
			});
		}

		const vocabulary = await VocabularyModel.findById(id);
		if (!vocabulary) {
			throw new ApiError({
				code: "not_found",
				message: "Vocabulary not found.",
				detail: null,
				status: 404,
			});
		}

		await this.validateBeforeDelete(id);
		return await VocabularyModel.findByIdAndDelete(id);
	}
}
