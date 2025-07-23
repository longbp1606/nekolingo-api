import mongoose, { Schema, Types, model } from "mongoose";

export interface IUserStreakProgress {
	userId: Types.ObjectId;
	date: Date;
	isStreak: boolean;
	isFreeze: boolean;
}

const UserStreakProgressSchema = new Schema<IUserStreakProgress>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		date: {
			type: Date,
			required: true,
			index: true,
		},
		isStreak: {
			type: Boolean,
			default: false,
		},
		isFreeze: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

UserStreakProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

export const UserStreakProgressModel = model<IUserStreakProgress>(
	"UserStreakProgress",
	UserStreakProgressSchema,
);
