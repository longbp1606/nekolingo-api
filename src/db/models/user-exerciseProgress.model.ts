import mongoose, { Schema, Types, HydratedDocument, Model } from "mongoose";

export interface IUserExerciseProgress {
	user_id: Types.ObjectId;
	exercise_id: Types.ObjectId;
	completed_at?: Date;
	is_mistake?: boolean;
	answer_time?: number;
	user_answer?: string;
	score?: number; // 1 nếu đúng, 0 nếu sai
}

export type UserExerciseProgressDocument =
	HydratedDocument<IUserExerciseProgress>;

const UserExerciseProgressSchema = new Schema<IUserExerciseProgress>(
	{
		user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		exercise_id: {
			type: Schema.Types.ObjectId,
			ref: "Exercise",
			required: true,
		},
		completed_at: { type: Date },
		is_mistake: { type: Boolean, default: false },
		answer_time: { type: Number },
		user_answer: { type: String },
		score: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

UserExerciseProgressSchema.index(
	{ user_id: 1, exercise_id: 1 },
	{ unique: true },
);

export const UserExerciseProgressModel = mongoose.model<IUserExerciseProgress>(
	"UserExerciseProgress",
	UserExerciseProgressSchema,
);
