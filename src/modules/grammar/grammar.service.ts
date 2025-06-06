import { Injectable } from "@nestjs/common";
import { GrammarModel, VocabTopicModel } from "@db/models";
import { CreateGrammarRequest, UpdateGrammarRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ValidationError } from "class-validator";
import { ApiValidationError, ApiError } from "@errors";
import { isValidObjectId } from "mongoose";

@Injectable()
export class GrammarService {
	async validateBeforeCreate(dto: CreateGrammarRequest) {
		const errors: ValidationError[] = [];
		const grammarExists = await GrammarModel.exists({
			grammar_id: dto.grammar_id,
		});

		if (grammarExists) {
			errors.push({
				property: "grammar_id",
				constraints: {
					grammarIdExists: "Grammar ID already exists",
				},
			});
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createGrammar(dto: CreateGrammarRequest) {
		await this.validateBeforeCreate(dto);
		const grammar = new GrammarModel(dto);
		return await grammar.save();
	}

	async getGrammars(page: number = 1, take: number = 10) {
		const skip = (page - 1) * take;
		const [grammars, total] = await Promise.all([
			GrammarModel.find().skip(skip).limit(take).exec(),
			GrammarModel.countDocuments(),
		]);

		const pagination = new PaginationDto(page, take, total);
		return { grammars, pagination };
	}

	async getGrammarById(id: string) {
		if (!isValidObjectId(id)) {
			throw new ApiError({
				code: "invalid_id",
				message: "Invalid grammar ID",
				detail: null,
				status: 400,
			});
		}

		const grammar = await GrammarModel.findById(id);
		if (!grammar) {
			throw new ApiError({
				code: "not_found",
				message: "Grammar not found",
				detail: null,
				status: 404,
			});
		}

		return grammar;
	}

	async updateGrammar(id: string, dto: UpdateGrammarRequest) {
		if (!isValidObjectId(id)) {
			throw new ApiError({
				code: "invalid_id",
				message: "Invalid grammar ID",
				detail: null,
				status: 400,
			});
		}

		const grammar = await GrammarModel.findByIdAndUpdate(id, dto, {
			new: true,
		});
		if (!grammar) {
			throw new ApiError({
				code: "not_found",
				message: "Grammar not found",
				detail: null,
				status: 404,
			});
		}

		return grammar;
	}

	async validateBeforeDelete(id: string) {
		// Check if grammar is referenced in VocabTopic
		const vocabTopicReferences = await VocabTopicModel.countDocuments({
			grammar_id: id,
		});

		if (vocabTopicReferences > 0) {
			throw new ApiError({
				code: "reference_constraint",
				message: `Cannot delete grammar. It is referenced by ${vocabTopicReferences} VocabTopic(s). Please remove these references first.`,
				detail: { references: vocabTopicReferences },
				status: 400,
			});
		}
	}

	async deleteGrammar(id: string) {
		if (!isValidObjectId(id)) {
			throw new ApiError({
				code: "invalid_id",
				message: "Invalid grammar ID",
				detail: null,
				status: 400,
			});
		}

		const grammar = await GrammarModel.findById(id);
		if (!grammar) {
			throw new ApiError({
				code: "not_found",
				message: "Grammar not found",
				detail: null,
				status: 404,
			});
		}

		await this.validateBeforeDelete(id);

		return await GrammarModel.findByIdAndDelete(id);
	}
}
