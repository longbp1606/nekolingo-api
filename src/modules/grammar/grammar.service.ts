import { Injectable } from "@nestjs/common";
import { GrammarModel } from "@db/models";
import { CreateGrammarRequest, UpdateGrammarRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ValidationError } from "class-validator";
import { ApiValidationError } from "@errors";

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
		return await GrammarModel.findById(id);
	}

	async updateGrammar(id: string, dto: UpdateGrammarRequest) {
		return await GrammarModel.findByIdAndUpdate(id, dto, { new: true });
	}

	async deleteGrammar(id: string) {
		return await GrammarModel.findByIdAndDelete(id);
	}
}
