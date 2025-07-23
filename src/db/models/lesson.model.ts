import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface ILesson {
	title: string;
	order: number;
	xp_reward: number;
	topic: Types.ObjectId;

	type: string[];
	mode: "normal" | "personalized" | "mixed" | "heart_recovery";

	description?: string;
	extra_data?: Record<string, any>;
}

export type LessonDocument = HydratedDocument<ILesson>;
export type LessonModelType = Model<ILesson, {}, {}, {}, LessonDocument>;

const ALLOWED_TYPES = [
	"vocabulary",
	"grammar",
	"listening",
	"reading",
	"speaking",
];

const ALLOWED_MODES = ["normal", "personalized", "mixed", "heart_recovery"];
const { Mixed } = Schema.Types;

const LessonSchema = new Schema<ILesson, LessonModelType>(
	{
		title: { type: String, required: true },

		order: {
			type: Number,
			required: function () {
				return this.mode === "normal";
			},
			min: 1,
		},

		xp_reward: { type: Number, required: true, default: 0, min: 0 },

		topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },

		type: {
			type: [String],
			required: true,
			validate: {
				validator: (arr: string[]) =>
					arr.length > 0 && arr.every((t) => ALLOWED_TYPES.includes(t)),
				message: "Lesson contains invalid type(s)",
			},
		},

		mode: {
			type: String,
			enum: ALLOWED_MODES,
			required: true,
			default: "normal",
		},

		description: { type: String, required: false },
		extra_data: { type: Mixed, required: false },
	},
	{ timestamps: true },
);

LessonSchema.index({ topic: 1, order: 1 }, { unique: true, sparse: true });

export const LessonModel = mongoose.model<ILesson, LessonModelType>(
	"Lesson",
	LessonSchema,
);

export { LessonSchema };
