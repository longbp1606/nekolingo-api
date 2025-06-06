import { Injectable } from "@nestjs/common";
import { isValidObjectId } from "mongoose";
import { VocabularyModel, VocabTopicModel } from "@db/models";
import { CreateVocabularyRequest, UpdateVocabularyRequest } from "./dto";
import { ApiValidationError, ApiError } from "@errors";
import { ValidationError } from "class-validator";
import { PaginationDto } from "@utils";

@Injectable()
export class VocabularyService {
	async validateBeforeCreate(dto: CreateVocabularyRequest) {
		const errors: ValidationError[] = [];

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
						"This vocabulary already exists for the selected languages.",
				},
			});
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
				message: "Invalid vocabulary ID",
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
				message: "Vocabulary not found",
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
				message: "Invalid vocabulary ID",
				detail: null,
				status: 400,
			});
		}

		const vocabulary = await VocabularyModel.findByIdAndUpdate(id, dto, {
			new: true,
		}).populate("language_from language_to");

		if (!vocabulary) {
			throw new ApiError({
				code: "not_found",
				message: "Vocabulary not found",
				detail: null,
				status: 404,
			});
		}

		return vocabulary;
	}

	async validateBeforeDelete(id: string) {
		const vocabTopicReferences = await VocabTopicModel.countDocuments({
			vocabulary_id: id,
		});

		if (vocabTopicReferences > 0) {
			throw new ApiError({
				code: "reference_constraint",
				message: `Cannot delete vocabulary. It is referenced by ${vocabTopicReferences} VocabTopic(s). Please remove these references first.`,
				detail: { references: vocabTopicReferences },
				status: 400,
			});
		}
	}

	async deleteVocabulary(id: string) {
		if (!isValidObjectId(id)) {
			throw new ApiError({
				code: "invalid_id",
				message: "Invalid vocabulary ID",
				detail: null,
				status: 400,
			});
		}

		const vocabulary = await VocabularyModel.findById(id);
		if (!vocabulary) {
			throw new ApiError({
				code: "not_found",
				message: "Vocabulary not found",
				detail: null,
				status: 404,
			});
		}

		await this.validateBeforeDelete(id);
		return await VocabularyModel.findByIdAndDelete(id);
	}
}
