import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import {
	ExerciseModel,
	LessonModel,
	VocabularyModel,
	GrammarModel,
} from "@db/models";
import { CreateExerciseRequest, UpdateExerciseRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ValidationError } from "class-validator";
import { ApiValidationError } from "@errors";
import { Types } from "mongoose";

@Injectable()
export class ExerciseService {
	private async validateReferencesExist(
		dto: CreateExerciseRequest | UpdateExerciseRequest,
	) {
		const errors: ValidationError[] = [];

		if (dto.lesson && !(await LessonModel.exists({ _id: dto.lesson }))) {
			errors.push({
				property: "lesson",
				constraints: { exists: "Lesson ID does not exist" },
			} as ValidationError);
		}

		if (
			dto.vocabulary &&
			!(await VocabularyModel.exists({ _id: dto.vocabulary }))
		) {
			errors.push({
				property: "vocabulary",
				constraints: { exists: "Vocabulary ID does not exist" },
			} as ValidationError);
		}

		if (dto.grammar && !(await GrammarModel.exists({ _id: dto.grammar }))) {
			errors.push({
				property: "grammar",
				constraints: { exists: "Grammar ID does not exist" },
			} as ValidationError);
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	private async validateBeforeCreate(dto: CreateExerciseRequest) {
		const errors: ValidationError[] = [];

		const exists = await ExerciseModel.exists({
			lesson: dto.lesson,
			question: dto.question,
		});

		if (exists) {
			errors.push({
				property: "question",
				constraints: {
					unique: "Exercise with same question already exists in this lesson",
				},
			} as ValidationError);
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createExercise(dto: CreateExerciseRequest) {
		await this.validateReferencesExist(dto);
		await this.validateBeforeCreate(dto);
		const ex = new ExerciseModel(dto);
		return await ex.save();
	}

	async getExercises(page: number = 1, take: number = 10) {
		const skip = (page - 1) * take;
		const [exercises, total] = await Promise.all([
			ExerciseModel.find()
				.skip(skip)
				.limit(take)
				.populate("lesson", "title")
				.populate("vocabulary", "word")
				.populate("grammar", "title")
				.exec(),
			ExerciseModel.countDocuments().exec(),
		]);
		const pagination = new PaginationDto(page, take, total);
		return { exercises, pagination };
	}

	async getExerciseById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}
		const ex = await ExerciseModel.findById(id)
			.populate("lesson", "title")
			.populate("vocabulary", "word")
			.populate("grammar", "title")
			.exec();
		if (!ex) {
			throw new NotFoundException(`Exercise with ID ${id} not found`);
		}
		return ex;
	}

	async updateExercise(id: string, dto: UpdateExerciseRequest) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		await this.validateReferencesExist(dto);

		if (dto.question || dto.lesson) {
			const filter: any = { _id: { $ne: id } };
			if (dto.question) filter.question = dto.question;
			if (dto.lesson) filter.lesson = dto.lesson;
			const exists = await ExerciseModel.exists(filter);
			if (exists) {
				throw new ApiValidationError([
					{
						property: "question",
						constraints: {
							unique:
								"Exercise with same question already exists in this lesson",
						},
					} as ValidationError,
				]);
			}
		}

		const updated = await ExerciseModel.findByIdAndUpdate(id, dto, {
			new: true,
		})
			.populate("lesson", "title")
			.populate("vocabulary", "word")
			.populate("grammar", "title")
			.exec();

		if (!updated) {
			throw new NotFoundException(`Exercise with ID ${id} not found`);
		}

		return updated;
	}

	async deleteExercise(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		const deleted = await ExerciseModel.findByIdAndDelete(id).exec();
		if (!deleted) {
			throw new NotFoundException(`Exercise with ID ${id} not found`);
		}

		return { message: "Deleted successfully" };
	}
}
