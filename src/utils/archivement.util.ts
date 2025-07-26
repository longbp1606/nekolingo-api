import {
	UserLessonProgressModel,
	UserExerciseProgressModel,
	UserCourseProgressModel,
} from "@db/models";
import { isSunday } from "date-fns";
import { HydratedDocument } from "mongoose";
import { IUser } from "@db/models/user.model";

export const archivementHandlers: Record<
	string,
	(user: HydratedDocument<IUser>, condition: any) => Promise<number>
> = {
	streak_days: async (user) => user.streak_days,
	total_xp: async (user) => user.xp,
	weekly_xp: async (user) => user.weekly_xp,
	freeze_count: async (user) => user.freeze_count,
	current_level: async (user) => user.current_level,

	first_mistake: async (user) =>
		(await UserExerciseProgressModel.exists({
			user_id: user._id,
			is_mistake: true,
		}))
			? 1
			: 0,

	first_practice: async (user) =>
		(await UserLessonProgressModel.exists({ user_id: user._id })) ? 1 : 0,

	complete_lessons: async (user) =>
		await UserLessonProgressModel.countDocuments({
			user_id: user._id,
			completed_at: { $ne: null },
		}),

	complete_courses: async (user) =>
		await UserCourseProgressModel.countDocuments({
			user_id: user._id,
			completed_at: { $ne: null },
		}),

	no_mistake_lesson: async (user) =>
		await UserLessonProgressModel.countDocuments({
			user_id: user._id,
			score: 100,
		}),

	streak_on_sunday: async (user) =>
		user.last_active_date &&
		isSunday(user.last_active_date) &&
		user.streak_days > 0
			? 1
			: 0,

	practice_evening: async (user) => {
		const now = new Date();
		const practiced = await UserLessonProgressModel.exists({
			user_id: user._id,
			completed_at: {
				$gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20),
				$lte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22),
			},
		});
		return practiced ? 1 : 0;
	},

	login_streak_7_days: async (user) => user.streak_days,
};
