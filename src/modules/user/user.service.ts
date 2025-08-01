import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserRequest } from "./dto";
import { ValidationError } from "class-validator";
import {
	UserModel,
	UserCourseProgressModel,
	UserLessonProgressModel,
	UserTopicProgressModel,
	UserStreakProgressModel,
} from "@db/models";
import { ApiValidationError } from "@errors";
import * as bcrypt from "bcrypt";
import { UpdateUserRequest } from "./dto/update-user.request";
import { Types } from "mongoose";
import { startOfWeek, addDays } from "date-fns";

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
		return UserModel.find({ is_active: true });
	}

	async getUserById(id: string) {
		const userId = new Types.ObjectId(id);

		const user = await UserModel.findOne({
			_id: userId,
			is_active: true,
		})
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

		const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
		const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

		const streakLogs = await UserStreakProgressModel.find({
			userId: user._id,
			date: { $gte: startOfThisWeek },
		});

		const streak_list = daysOfWeek.map((day, index) => {
			const date = addDays(startOfThisWeek, index);
			const log = streakLogs.find(
				(entry) => entry.date.toDateString() === date.toDateString(),
			);
			return {
				day,
				isStreak: !!log?.isStreak,
				isFreeze: !!log?.isFreeze,
			};
		});

		return {
			user,
			current_course: currentCourse,
			current_topic: currentTopic,
			current_lesson: currentLesson,
			lesson_status: lessonStatus,
			completed_topics: completedTopics,
			completed_courses: completedCourses,
			streak_list,
		};
	}

	async createUser(dto: CreateUserRequest) {
		await this.validateBeforeCreate(dto);
		const user = new UserModel({
			...dto,
			password: bcrypt.hashSync(dto.password, 10),
			is_active: true,
		});
		await user.save();
	}

	async updateUser(id: string, dto: UpdateUserRequest) {
		const user = await UserModel.findById(id);
		if (!user) return;

		const newBalance =
			dto.balance !== undefined
				? (user.balance || 0) + dto.balance
				: user.balance;

		await UserModel.findByIdAndUpdate(id, {
			...dto,
			balance: newBalance,
		});
	}

	async deleteUser(id: string) {
		await UserModel.findByIdAndUpdate(id, { is_active: false });
	}
}
