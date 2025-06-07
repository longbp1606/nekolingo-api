import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";
import {
	TopicModel,
	CourseModel,
	LessonModel,
	VocabTopicModel,
} from "@db/models";
import { CreateTopicRequest, UpdateTopicRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ValidationError } from "class-validator";
import { ApiValidationError } from "@errors";
import { Types } from "mongoose";

@Injectable()
export class TopicService {
	async validateBeforeCreate(dto: CreateTopicRequest) {
		const errors: ValidationError[] = [];

		if (!Types.ObjectId.isValid(dto.course)) {
			errors.push({
				property: "course",
				constraints: {
					invalidObjectId: "Invalid course ID format",
				},
			});
		} else {
			const courseExists = await CourseModel.exists({ _id: dto.course });
			if (!courseExists) {
				errors.push({
					property: "course",
					constraints: {
						courseNotFound: "Course not found",
					},
				});
			}
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createTopic(dto: CreateTopicRequest) {
		await this.validateBeforeCreate(dto);
		const topic = new TopicModel(dto);
		return await topic.save();
	}

	async getTopics(page: number = 1, take: number = 10, courseId?: string) {
		const skip = (page - 1) * take;
		const filter = courseId ? { course: courseId } : {};

		const [topics, total] = await Promise.all([
			TopicModel.find(filter)
				.populate("course", "title")
				.sort({ order: 1 })
				.skip(skip)
				.limit(take)
				.exec(),
			TopicModel.countDocuments(filter),
		]);

		const pagination = new PaginationDto(page, take, total);
		return { topics, pagination };
	}

	async getTopicById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		const topic = await TopicModel.findById(id)
			.populate("course", "title description")
			.exec();

		if (!topic) {
			throw new NotFoundException(`Topic with ID ${id} not found`);
		}

		return topic;
	}

	async updateTopic(id: string, dto: UpdateTopicRequest) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		const topic = await TopicModel.findByIdAndUpdate(id, dto, { new: true })
			.populate("course", "title")
			.exec();

		if (!topic) {
			throw new NotFoundException(`Topic with ID ${id} not found`);
		}

		return topic;
	}

	async deleteTopic(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		const hasLessons = await LessonModel.exists({ topic: id });
		if (hasLessons) {
			throw new BadRequestException("Cannot delete topic that has lessons");
		}

		const hasVocabTopics = await VocabTopicModel.exists({ topic: id });
		if (hasVocabTopics) {
			throw new BadRequestException(
				"Cannot delete topic that has vocabulary or grammar associations",
			);
		}

		const topic = await TopicModel.findByIdAndDelete(id);
		if (!topic) {
			throw new NotFoundException(`Topic with ID ${id} not found`);
		}

		return topic;
	}

	async getTopicsByCourse(courseId: string) {
		if (!Types.ObjectId.isValid(courseId)) {
			throw new NotFoundException(`Invalid course ID: ${courseId}`);
		}

		return await TopicModel.find({ course: courseId })
			.sort({ order: 1 })
			.exec();
	}
}
