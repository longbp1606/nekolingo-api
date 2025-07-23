import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";
import { UserRoleEnum } from "src/utils/enum";

export interface IUser {
	email: string;
	password: string;
	role: UserRoleEnum;
	username: string;
	avatar_url: string;
	current_level: number;
	xp: number;
	weekly_xp: number;
	hearts: number;
	streak_days: number;
	backup_streak_days?: number;
	is_freeze: boolean;
	last_active_date?: Date;
	freeze_count: number;
	language_from: string;
	language_to: string;
	is_premiere: boolean;
	balance: number;
	is_active: boolean;
	double_or_nothing?: {
		start_date: Date;
		is_active: boolean;
		is_completed: boolean;
	};
	current_course?: Types.ObjectId;
	current_topic?: Types.ObjectId;
	current_lesson?: Types.ObjectId;
	createdAt?: Date;
	updatedAt?: Date;
}

export type UserDocumentType = HydratedDocument<IUser>;
export type UserModelType = Model<IUser, {}, {}, {}, UserDocumentType>;

const UserSchema = new Schema<IUser, UserModelType>(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: Number, enum: UserRoleEnum, default: UserRoleEnum.USER },
		username: { type: String },
		avatar_url: { type: String },
		current_level: { type: Number, default: 1 },
		xp: { type: Number, default: 0 },
		weekly_xp: { type: Number, default: 0 },
		hearts: { type: Number, default: 5 },
		streak_days: { type: Number, default: 0 },
		backup_streak_days: { type: Number, default: 0 },
		is_freeze: { type: Boolean, default: false },
		last_active_date: { type: Date },
		freeze_count: { type: Number, default: 0 },
		language_from: { type: String },
		language_to: { type: String },
		is_premiere: { type: Boolean, default: false },
		balance: { type: Number, default: 0 },
		is_active: { type: Boolean, default: true },
		double_or_nothing: {
			type: {
				start_date: { type: Date, required: true },
				is_active: { type: Boolean, default: true },
				is_completed: { type: Boolean, default: false },
			},
			default: null,
		},

		current_course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
		current_topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
		current_lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
	},
	{ timestamps: true },
);

export const UserModel = mongoose.model<IUser, UserModelType>(
	"User",
	UserSchema,
);
