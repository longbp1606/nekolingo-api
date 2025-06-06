import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface IExercise {
	type: "vocabulary" | "grammar" | "listening" | "reading" | "speaking";
	question_format:
		| "fill_in_blank"
		| "match"
		| "reorder"
		| "image_select"
		| "multiple_choice"
		| "true_false";

	question: string;
	correct_answer: string | string[] | number | object;
	options?: string[];
	audio_url?: string;
	image_url?: string;

	lesson: Types.ObjectId;
	vocabulary?: Types.ObjectId;
	grammar?: Types.ObjectId;

	extra_data?: Record<string, any>;
}

export type ExerciseDocument = HydratedDocument<IExercise>;

export type ExerciseModelType = Model<IExercise, {}, {}, {}, ExerciseDocument>;

const ExerciseSchema = new Schema<IExercise, ExerciseModelType>(
	{
		type: {
			type: String,
			required: true,
			enum: ["vocabulary", "grammar", "listening", "reading", "speaking"],
		},
		question_format: {
			type: String,
			required: true,
			enum: [
				"fill_in_blank",
				"match",
				"reorder",
				"image_select",
				"multiple_choice",
				"true_false",
			],
		},
		question: { type: String, required: true },
		correct_answer: { type: Schema.Types.Mixed, required: true },
		options: { type: [String], required: false },
		audio_url: { type: String, required: false },
		image_url: { type: String, required: false },
		lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
		vocabulary: {
			type: Schema.Types.ObjectId,
			ref: "Vocabulary",
			required: false,
		},
		grammar: { type: Schema.Types.ObjectId, ref: "Grammar", required: false },
		extra_data: { type: Schema.Types.Mixed, required: false },
	},
	{ timestamps: true },
);

export const ExerciseModel = mongoose.model<IExercise, ExerciseModelType>(
	"Exercise",
	ExerciseSchema,
);
