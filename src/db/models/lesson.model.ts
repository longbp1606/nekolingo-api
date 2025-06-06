import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface ILesson {
	title: string;
	order: number;
	xp_reward: number;
	topic: Types.ObjectId;

	type: "vocabulary" | "grammar" | "listening" | "reading" | "speaking";
	description?: string;
}

export type LessonDocument = HydratedDocument<ILesson>;
export type LessonModelType = Model<ILesson, {}, {}, {}, LessonDocument>;

const LessonSchema = new Schema<ILesson, LessonModelType>(
	{
		title: { type: String, required: true },

		order: { type: Number, required: true, min: 1 },

		xp_reward: { type: Number, required: true, default: 0, min: 0 },

		topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },

		type: {
			type: String,
			required: true,
			enum: ["vocabulary", "grammar", "listening", "reading", "speaking"],
		},

		description: { type: String, required: false },
	},
	{ timestamps: true },
);

LessonSchema.index({ topic: 1, order: 1 }, { unique: true });

export const LessonModel = mongoose.model<ILesson, LessonModelType>(
	"Lesson",
	LessonSchema,
);

export { LessonSchema };
