import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import { LessonModel, TopicModel, ExerciseModel } from "@db/models";
import { CreateLessonRequest, UpdateLessonRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ValidationError } from "class-validator";
import { ApiValidationError } from "@errors";
import { Types } from "mongoose";

@Injectable()
export class LessonService {
	private async validateReferences(
		dto: CreateLessonRequest | UpdateLessonRequest,
	) {
		const errors: ValidationError[] = [];

		if (dto.topic && !(await TopicModel.exists({ _id: dto.topic }))) {
			errors.push({
				property: "topic",
				constraints: { exists: "Topic ID does not exist" },
			} as ValidationError);
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	private async validateBeforeCreate(dto: CreateLessonRequest) {
		const errors: ValidationError[] = [];

		const exists = await LessonModel.exists({
			topic: dto.topic,
			order: dto.order,
		});

		if (exists) {
			errors.push({
				property: "order",
				constraints: {
					unique: "A lesson with this order already exists in the same topic",
				},
			} as ValidationError);
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createLesson(dto: CreateLessonRequest) {
		await this.validateReferences(dto);
		await this.validateBeforeCreate(dto);
		const lesson = new LessonModel(dto);
		return await lesson.save();
	}

	async getLessons(page: number = 1, take: number = 10) {
		const skip = (page - 1) * take;
		const [lessons, total] = await Promise.all([
			LessonModel.find()
				.skip(skip)
				.limit(take)
				.populate("topic", "title")
				.exec(),
			LessonModel.countDocuments().exec(),
		]);
		const pagination = new PaginationDto(page, take, total);
		return { lessons, pagination };
	}

	async getLessonById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}
		const lesson = await LessonModel.findById(id)
			.populate("topic", "title")
			.exec();
		if (!lesson) {
			throw new NotFoundException(`Lesson with ID ${id} not found`);
		}
		return lesson;
	}

	async updateLesson(id: string, dto: UpdateLessonRequest) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		await this.validateReferences(dto);

		if (dto.order || dto.topic) {
			const filter: any = { _id: { $ne: id } };
			if (dto.order) filter.order = dto.order;
			if (dto.topic) filter.topic = dto.topic;

			const exists = await LessonModel.exists(filter);
			if (exists) {
				throw new ApiValidationError([
					{
						property: "order",
						constraints: {
							unique:
								"A lesson with this order already exists in the same topic",
						},
					} as ValidationError,
				]);
			}
		}

		const updated = await LessonModel.findByIdAndUpdate(id, dto, { new: true })
			.populate("topic", "title")
			.exec();

		if (!updated) {
			throw new NotFoundException(`Lesson with ID ${id} not found`);
		}

		return updated;
	}

	async deleteLesson(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		const hasExercises = await ExerciseModel.exists({ lesson: id });
		if (hasExercises) {
			throw new BadRequestException(
				`Cannot delete lesson with exercises linked`,
			);
		}

		const deleted = await LessonModel.findByIdAndDelete(id).exec();
		if (!deleted) {
			throw new NotFoundException(`Lesson with ID ${id} not found`);
		}

		return { message: "Deleted successfully" };
	}
}
