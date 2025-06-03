import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import { CourseModel, LanguageModel, LessonModel } from "@db/models";
import { CreateCourseRequest, UpdateCourseRequest } from "./dto";
import { PaginationDto } from "@utils";
import { ValidationError } from "class-validator";
import { ApiValidationError } from "@errors";
import { Types } from "mongoose";

@Injectable()
export class CourseService {
	private async validateBeforeCreate(dto: CreateCourseRequest) {
		const errors: ValidationError[] = [];

		const languageFromExists = await LanguageModel.exists({
			_id: dto.language_from,
		});
		if (!languageFromExists) {
			errors.push({
				property: "language_from",
				constraints: { exists: "Language from not found in database" },
			} as ValidationError);
		}

		const languageToExists = await LanguageModel.exists({
			_id: dto.language_to,
		});
		if (!languageToExists) {
			errors.push({
				property: "language_to",
				constraints: { exists: "Language to not found in database" },
			} as ValidationError);
		}

		const exists = await CourseModel.exists({
			title: dto.title,
			language_from: dto.language_from,
			language_to: dto.language_to,
		});
		if (exists) {
			errors.push({
				property: "title",
				constraints: {
					unique: "Course with same title & languages already exists",
				},
			} as ValidationError);
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createCourse(dto: CreateCourseRequest) {
		await this.validateBeforeCreate(dto);
		const course = new CourseModel(dto);
		return await course.save();
	}

	async getCourses(page: number = 1, take: number = 10) {
		const skip = (page - 1) * take;
		const [courses, total] = await Promise.all([
			CourseModel.find()
				.skip(skip)
				.limit(take)
				.populate("language_from", "name code")
				.populate("language_to", "name code")
				.exec(),
			CourseModel.countDocuments().exec(),
		]);
		const pagination = new PaginationDto(page, take, total);
		return { courses, pagination };
	}

	async getCourseById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}
		const course = await CourseModel.findById(id)
			.populate("language_from", "name code")
			.populate("language_to", "name code")
			.exec();
		if (!course) {
			throw new NotFoundException(`Course with ID ${id} not found`);
		}
		return course;
	}

	async updateCourse(id: string, dto: UpdateCourseRequest) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		const errors: ValidationError[] = [];

		if (dto.language_from) {
			const fromExists = await LanguageModel.exists({ _id: dto.language_from });
			if (!fromExists) {
				errors.push({
					property: "language_from",
					constraints: { exists: "Language from not found" },
				} as ValidationError);
			}
		}
		if (dto.language_to) {
			const toExists = await LanguageModel.exists({ _id: dto.language_to });
			if (!toExists) {
				errors.push({
					property: "language_to",
					constraints: { exists: "Language to not found" },
				} as ValidationError);
			}
		}

		if (dto.title || dto.language_from || dto.language_to) {
			const filter: any = { _id: { $ne: id } };
			if (dto.title) filter.title = dto.title;
			if (dto.language_from) filter.language_from = dto.language_from;
			if (dto.language_to) filter.language_to = dto.language_to;

			const exists = await CourseModel.exists(filter);
			if (exists) {
				errors.push({
					property: "title",
					constraints: {
						unique: "Course with same title & languages already exists",
					},
				} as ValidationError);
			}
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}

		const updated = await CourseModel.findByIdAndUpdate(id, dto, {
			new: true,
		}).exec();
		if (!updated) {
			throw new NotFoundException(`Course with ID ${id} not found`);
		}
		return updated;
	}

	async deleteCourse(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Invalid ID: ${id}`);
		}

		const course = await CourseModel.findById(id).exec();
		if (!course) {
			throw new NotFoundException(`Course with ID ${id} not found`);
		}

		const hasLessons = await LessonModel.exists({ course: id });
		if (hasLessons) {
			throw new BadRequestException("Cannot delete course that has lessons");
		}

		await course.deleteOne();
		return { message: "Deleted successfully" };
	}
}
