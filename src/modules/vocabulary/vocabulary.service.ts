import { Injectable } from "@nestjs/common";
import { VocabularyModel, VocabTopicModel } from "@db/models";
import { CreateVocabularyRequest, UpdateVocabularyRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ValidationError } from "class-validator";
import { ApiValidationError, ApiError } from "@errors";
import { isValidObjectId } from "mongoose";

@Injectable()
export class VocabularyService {
	async validateBeforeCreate(dto: CreateVocabularyRequest) {
		const errors: ValidationError[] = [];
		const vocabularyExists = await VocabularyModel.exists({
			vocabulary_id: dto.vocabulary_id,
		});

		if (vocabularyExists) {
			errors.push({
				property: "vocabulary_id",
				constraints: {
					vocabularyIdExists: "Vocabulary ID already exists",
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

	async getVocabularies(page: number = 1, take: number = 10) {
		const skip = (page - 1) * take;
		const [vocabularies, total] = await Promise.all([
			VocabularyModel.find().skip(skip).limit(take).exec(),
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

		const vocabulary = await VocabularyModel.findById(id);
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
		});
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
		// Check if vocabulary is referenced in VocabTopic
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
