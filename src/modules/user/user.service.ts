import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserRequest } from "./dto";
import { ValidationError } from "class-validator";
import {
	UserModel,
	UserCourseProgressModel,
	UserLessonProgressModel,
	UserTopicProgressModel,
} from "@db/models";
import { ApiValidationError } from "@errors";
import * as bcrypt from "bcrypt";
import { UpdateUserRequest } from "./dto/update-user.request";
import { Types } from "mongoose";

@Injectable()
export class UserService {
	async validateBeforeCreate(dto: CreateUserRequest) {
		const errors: ValidationError[] = [];

		const emailExisted = await UserModel.exists({ email: dto.email });
		if (emailExisted) {
			errors.push({
				property: "email",
				constraints: {
					emailExisted: "Email already existed",
				},
			});
		}

		if (errors.length > 0) throw new ApiValidationError(errors);
	}

	async getUsers() {
		return UserModel.find();
	}

	async getUserById(id: string) {
		const userId = new Types.ObjectId(id);

		const user = await UserModel.findById(userId)
			.populate("current_lesson")
			.populate("current_topic")
			.populate("current_course");

		if (!user) throw new NotFoundException("User not found");

		let lessonStatus: "not_started" | "in_progress" | "completed" =
			"not_started";

		let currentLesson = null;
		if (user.current_lesson && "title" in user.current_lesson) {
			const lesson = user.current_lesson as any;
			currentLesson = {
				id: lesson._id,
				title: lesson.title,
				mode: lesson.mode,
			};

			const lessonProgress = await UserLessonProgressModel.findOne({
				user_id: userId,
				lesson_id: lesson._id,
			});

			if (lessonProgress?.completed_at) {
				lessonStatus = "completed";
			} else if (lessonProgress) {
				lessonStatus = "in_progress";
			}
		}

		let currentTopic = null;
		if (user.current_topic && "title" in user.current_topic) {
			currentTopic = {
				id: user.current_topic._id,
				title: (user.current_topic as any).title,
			};
		}

		let currentCourse = null;
		if (user.current_course && "title" in user.current_course) {
			currentCourse = {
				id: user.current_course._id,
				title: (user.current_course as any).title,
			};
		}

		const completedTopicDocs = await UserTopicProgressModel.find({
			user_id: userId,
			proficiency_level: { $gte: 100 },
		}).populate("topic_id");

		const completedTopics = completedTopicDocs
			.filter((p) => p.topic_id && "title" in p.topic_id)
			.map((p) => ({
				id: (p.topic_id as any)._id,
				title: (p.topic_id as any).title,
			}));

		const completedCourseDocs = await UserCourseProgressModel.find({
			user_id: userId,
			completed_at: { $ne: null },
		}).populate("course_id");

		const completedCourses = completedCourseDocs
			.filter((c) => c.course_id && "title" in c.course_id)
			.map((c) => ({
				id: (c.course_id as any)._id,
				title: (c.course_id as any).title,
			}));

		return {
			user,
			current_course: currentCourse,
			current_topic: currentTopic,
			current_lesson: currentLesson,
			lesson_status: lessonStatus,
			completed_topics: completedTopics,
			completed_courses: completedCourses,
		};
	}

	async createUser(dto: CreateUserRequest) {
		await this.validateBeforeCreate(dto);
		const user = new UserModel({
			...dto,
			password: bcrypt.hashSync(dto.password, 10),
		});
		await user.save();
	}

	async updateUser(id: string, dto: UpdateUserRequest) {
		await UserModel.findByIdAndUpdate(id, dto);
	}

	async deleteUser(id: string) {
		await UserModel.findByIdAndDelete(id);
	}
}
