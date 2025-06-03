import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface ICourse {
	title: string;
	description?: string;
	language_from: Types.ObjectId;
	language_to: Types.ObjectId;
}

export type CourseDocument = HydratedDocument<ICourse>;

export type CourseModelType = Model<ICourse, {}, {}, {}, CourseDocument>;

const CourseSchema = new Schema<ICourse, CourseModelType>(
	{
		title: { type: String, required: true },
		description: { type: String, required: false },
		language_from: {
			type: Schema.Types.ObjectId,
			ref: "Language",
			required: true,
		},
		language_to: {
			type: Schema.Types.ObjectId,
			ref: "Language",
			required: true,
		},
	},
	{ timestamps: true },
);

export const CourseModel = mongoose.model<ICourse, CourseModelType>(
	"Course",
	CourseSchema,
);

export { CourseSchema };
