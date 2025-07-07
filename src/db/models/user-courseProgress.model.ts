import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface IUserCourseProgress {
	user_id: Types.ObjectId;
	course_id: Types.ObjectId;
	start_date?: Date;
	completed_at?: Date;
}

export type UserCourseProgressDocumentType =
	HydratedDocument<IUserCourseProgress>;

export type UserCourseProgressModelType = Model<
	IUserCourseProgress,
	{},
	{},
	UserCourseProgressDocumentType
>;

const UserCourseProgressSchema = new Schema<
	IUserCourseProgress,
	UserCourseProgressModelType
>(
	{
		user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		course_id: { type: Schema.Types.ObjectId, ref: "Course", required: true },
		start_date: { type: Date },
		completed_at: { type: Date },
	},
	{ timestamps: true },
);

UserCourseProgressSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

export const UserCourseProgressModel = mongoose.model<
	IUserCourseProgress,
	UserCourseProgressModelType
>("UserCourseProgress", UserCourseProgressSchema);
