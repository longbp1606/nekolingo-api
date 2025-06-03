import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { UserRoleEnum } from "src/utils/enum";

export interface IUser {
	email: string;
	password: string;
	role: UserRoleEnum;
	username: string;
	avatar_url: string;
	current_level: number;
	xp: number;
	streak_days: number;
	language_from: string;
	language_to: string;
	is_premiere: boolean;
}

export type UserDocumentType = HydratedDocument<IUser>;

export type UserModelType = Model<IUser, {}, {}, {}, UserDocumentType>;

const UserSchema = new Schema<IUser, UserModelType>(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: Number, enum: UserRoleEnum, default: UserRoleEnum.USER },
		username: { type: String, required: false },
		avatar_url: { type: String, required: false },
		current_level: { type: Number, required: false, default: 1 },
		xp: { type: Number, required: false, default: 0 },
		streak_days: { type: Number, required: false, default: 0 },
		language_from: { type: String, required: false },
		language_to: { type: String, required: false },
		is_premiere: { type: Boolean, required: false, default: false },
	},
	{ timestamps: true },
);

export const UserModel = mongoose.model<IUser, UserModelType>(
	"User",
	UserSchema,
);
