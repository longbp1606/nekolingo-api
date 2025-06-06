import { Injectable } from "@nestjs/common";
import { GrammarModel, VocabTopicModel } from "@db/models";
import { CreateGrammarRequest, UpdateGrammarRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ApiValidationError, ApiError } from "@errors";
import { isValidObjectId } from "mongoose";

@Injectable()
export class GrammarService {
	async createGrammar(data: CreateGrammarRequest) {
		const grammar = new GrammarModel(data);
		return await grammar.save();
	}

	async getGrammars(page = 1, take = 10) {
		const skip = (page - 1) * take;
		const [grammars, total] = await Promise.all([
			GrammarModel.find().skip(skip).limit(take).lean(),
			GrammarModel.countDocuments(),
		]);
		const pagination = new PaginationDto(page, take, total);
		return { grammars, pagination };
	}

	async getGrammarById(id: string) {
		this.ensureValidId(id);
		const grammar = await GrammarModel.findById(id).lean();
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
		this.ensureValidId(id);
		const updated = await GrammarModel.findByIdAndUpdate(id, dto, {
			new: true,
			lean: true,
		});

		if (!updated) {
			throw new ApiError({
				code: "not_found",
				message: "Grammar not found",
				detail: null,
				status: 404,
			});
		}

		return updated;
	}

	async deleteGrammar(id: string) {
		this.ensureValidId(id);
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
		await GrammarModel.findByIdAndDelete(id);
	}

	async validateBeforeDelete(id: string) {
		const references = await VocabTopicModel.countDocuments({
			grammar_id: id,
		});
		if (references > 0) {
			throw new ApiError({
				code: "reference_constraint",
				message: `Cannot delete grammar. It is referenced by ${references} VocabTopic(s). Please remove these references first.`,
				detail: { references },
				status: 400,
			});
		}
	}

	private ensureValidId(id: string) {
		if (!isValidObjectId(id)) {
			throw new ApiError({
				code: "invalid_id",
				message: "Invalid grammar ID",
				detail: null,
				status: 400,
			});
		}
	}
}
