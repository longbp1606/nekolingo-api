import { Injectable } from "@nestjs/common";
import { VocabularyModel } from "@db/models";
import { CreateVocabularyRequest, UpdateVocabularyRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ValidationError } from "class-validator";
import { ApiValidationError } from "@errors";

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
		return await VocabularyModel.findById(id);
	}

	async updateVocabulary(id: string, dto: UpdateVocabularyRequest) {
		return await VocabularyModel.findByIdAndUpdate(id, dto, { new: true });
	}

	async deleteVocabulary(id: string) {
		return await VocabularyModel.findByIdAndDelete(id);
	}
}
