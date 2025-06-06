import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";
import {
	VocabTopicModel,
	TopicModel,
	VocabularyModel,
	GrammarModel,
} from "@db/models";
import { CreateVocabTopicRequest, UpdateVocabTopicRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ValidationError } from "class-validator";
import { ApiValidationError } from "@errors";
import { Types } from "mongoose";

@Injectable()
export class VocabTopicService {
	async validateBeforeCreate(dto: CreateVocabTopicRequest) {
		const errors: ValidationError[] = [];

		// Ensure at least one of vocabulary or grammar is provided
		if (!dto.vocabulary && !dto.grammar) {
			errors.push({
				property: "vocabulary",
				constraints: {
					requireVocabOrGrammar:
						"Either vocabulary or grammar must be provided",
				},
			});
		}

		// Validate topic exists
		if (!Types.ObjectId.isValid(dto.topic)) {
			errors.push({
				property: "topic",
				constraints: {
					invalidObjectId: "Invalid topic ID format",
				},
			});
		} else {
			const topicExists = await TopicModel.exists({ _id: dto.topic });
			if (!topicExists) {
				errors.push({
					property: "topic",
					constraints: {
						topicNotFound: "Topic not found",
					},
				});
			}
		}

		// Validate vocabulary exists if provided
		if (dto.vocabulary) {
			if (!Types.ObjectId.isValid(dto.vocabulary)) {
				errors.push({
					property: "vocabulary",
					constraints: {
						invalidObjectId: "Invalid vocabulary ID format",
					},
				});
			} else {
				const vocabularyExists = await VocabularyModel.exists({
					_id: dto.vocabulary,
				});
				if (!vocabularyExists) {
					errors.push({
						property: "vocabulary",
						constraints: {
							vocabularyNotFound: "Vocabulary not found",
						},
					});
				}
			}
		}

		// Validate grammar exists if provided
		if (dto.grammar) {
			if (!Types.ObjectId.isValid(dto.grammar)) {
				errors.push({
					property: "grammar",
					constraints: {
						invalidObjectId: "Invalid grammar ID format",
					},
				});
			} else {
				const grammarExists = await GrammarModel.exists({ _id: dto.grammar });
				if (!grammarExists) {
					errors.push({
						property: "grammar",
						constraints: {
							grammarNotFound: "Grammar not found",
						},
					});
				}
			}
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createVocabTopic(dto: CreateVocabTopicRequest) {
		await this.validateBeforeCreate(dto);
		const vocabTopic = new VocabTopicModel(dto);
		return await vocabTopic.save();
	}

	async getVocabTopics(page: number = 1, take: number = 10, topicId?: string) {
		const skip = (page - 1) * take;
		const filter = topicId ? { topic: topicId } : {};

		const [vocabTopics, total] = await Promise.all([
			VocabTopicModel.find(filter)
				.populate("topic", "title")
				.populate("vocabulary", "word meaning")
				.populate("grammar", "name description")
				.sort({ order: 1 })
				.skip(skip)
				.limit(take)
				.exec(),
			VocabTopicModel.countDocuments(filter),
		]);

		const pagination = new PaginationDto(page, take, total);
		return { vocabTopics, pagination };
	}

	async getVocabTopicById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		const vocabTopic = await VocabTopicModel.findById(id)
			.populate("topic", "title description")
			.populate("vocabulary", "word meaning pronunciation_us pronunciation_uk")
			.populate("grammar", "name description")
			.exec();

		if (!vocabTopic) {
			throw new NotFoundException(`VocabTopic with ID ${id} not found`);
		}

		return vocabTopic;
	}

	async updateVocabTopic(id: string, dto: UpdateVocabTopicRequest) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		// If updating vocabulary or grammar, validate they exist
		if (dto.vocabulary && !Types.ObjectId.isValid(dto.vocabulary)) {
			throw new BadRequestException("Invalid vocabulary ID format");
		}
		if (dto.grammar && !Types.ObjectId.isValid(dto.grammar)) {
			throw new BadRequestException("Invalid grammar ID format");
		}

		if (dto.vocabulary) {
			const vocabularyExists = await VocabularyModel.exists({
				_id: dto.vocabulary,
			});
			if (!vocabularyExists) {
				throw new BadRequestException("Vocabulary not found");
			}
		}

		if (dto.grammar) {
			const grammarExists = await GrammarModel.exists({ _id: dto.grammar });
			if (!grammarExists) {
				throw new BadRequestException("Grammar not found");
			}
		}

		const vocabTopic = await VocabTopicModel.findByIdAndUpdate(id, dto, {
			new: true,
		})
			.populate("topic", "title")
			.populate("vocabulary", "word meaning")
			.populate("grammar", "name description")
			.exec();

		if (!vocabTopic) {
			throw new NotFoundException(`VocabTopic with ID ${id} not found`);
		}

		return vocabTopic;
	}

	async deleteVocabTopic(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		const vocabTopic = await VocabTopicModel.findByIdAndDelete(id);
		if (!vocabTopic) {
			throw new NotFoundException(`VocabTopic with ID ${id} not found`);
		}

		return vocabTopic;
	}

	async getVocabTopicsByTopic(topicId: string) {
		if (!Types.ObjectId.isValid(topicId)) {
			throw new NotFoundException(`Invalid topic ID: ${topicId}`);
		}

		return await VocabTopicModel.find({ topic: topicId })
			.populate("vocabulary", "word meaning pronunciation_us pronunciation_uk")
			.populate("grammar", "name description")
			.sort({ order: 1 })
			.exec();
	}
}
