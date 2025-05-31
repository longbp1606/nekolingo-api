import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { UserRoleEnum } from "src/utils/enum";

export interface IUser {
	email: string;
	password: string;
	role: UserRoleEnum;
}

export type UserDocumentType = HydratedDocument<IUser>;

export type UserModelType = Model<IUser, {}, {}, {}, UserDocumentType>;

const UserSchema = new Schema<IUser, UserModelType>(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: Number, enum: UserRoleEnum, default: UserRoleEnum.USER },
	},
	{ timestamps: true },
);

export const UserModel = mongoose.model<IUser, UserModelType>(
	"User",
	UserSchema,
);
