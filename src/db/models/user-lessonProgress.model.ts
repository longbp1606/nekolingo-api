import mongoose, { Schema, Types, HydratedDocument, Model } from "mongoose";

export interface IUserLessonProgress {
	user_id: Types.ObjectId;
	lesson_id: Types.ObjectId;
	completed_at?: Date;
	score?: number;
	xp_earned?: number;
	used_in_personalized?: boolean;
}

export type UserLessonProgressDocument = HydratedDocument<IUserLessonProgress>;

const UserLessonProgressSchema = new Schema<IUserLessonProgress>(
	{
		user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		lesson_id: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
		completed_at: { type: Date },
		score: { type: Number, default: 0 },
		xp_earned: { type: Number, default: 0 },
		used_in_personalized: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

UserLessonProgressSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });

export const UserLessonProgressModel = mongoose.model<IUserLessonProgress>(
	"UserLessonProgress",
	UserLessonProgressSchema,
);
