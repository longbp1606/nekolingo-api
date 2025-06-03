import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface ILesson {
	title: string;
	order: number;
	xp_reward: number;
	topic: Types.ObjectId;
}

export type LessonDocument = HydratedDocument<ILesson>;

export type LessonModelType = Model<ILesson, {}, {}, {}, LessonDocument>;

const LessonSchema = new Schema<ILesson, LessonModelType>(
	{
		title: { type: String, required: true },
		order: { type: Number, required: true },
		xp_reward: { type: Number, required: true, default: 0 },
		topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
	},
	{ timestamps: true },
);

export const LessonModel = mongoose.model<ILesson, LessonModelType>(
	"Lesson",
	LessonSchema,
);

export { LessonSchema };
