import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface IExercise {
	type: string;
	question_format:
		| "fill_in_blank"
		| "match"
		| "reorder"
		| "image_select"
		| "multiple_choice"
		| "true_false";

	question: string;
	correct_answer: string | string[] | number | object | object[];

	options?: string[] | object[];
	audio_url?: string;
	image_url?: string;

	lesson: Types.ObjectId;
	vocabulary?: Types.ObjectId;
	grammar?: Types.ObjectId;

	extra_data?: Record<string, any>;
}

export type ExerciseDocument = HydratedDocument<IExercise>;
export type ExerciseModelType = Model<IExercise, {}, {}, {}, ExerciseDocument>;

const ALLOWED_TYPES = [
	"vocabulary",
	"grammar",
	"listening",
	"reading",
	"speaking",
];

const ALLOWED_FORMATS = [
	"fill_in_blank",
	"match",
	"reorder",
	"image_select",
	"multiple_choice",
	"true_false",
];

const ExerciseSchema = new Schema<IExercise, ExerciseModelType>(
	{
		type: {
			type: String,
			required: true,
			validate: {
				validator: (value: string) => ALLOWED_TYPES.includes(value),
				message: (props) => `Invalid exercise type: ${props.value}`,
			},
		},
		question_format: {
			type: String,
			required: true,
			enum: ALLOWED_FORMATS,
		},
		question: { type: String, required: true },
		correct_answer: { type: Schema.Types.Mixed, required: true },
		options: { type: [String] },
		audio_url: { type: String },
		image_url: { type: String },
		lesson: {
			type: Schema.Types.ObjectId,
			ref: "Lesson",
			required: true,
		},
		vocabulary: { type: Schema.Types.ObjectId, ref: "Vocabulary" },
		grammar: { type: Schema.Types.ObjectId, ref: "Grammar" },
		extra_data: { type: Schema.Types.Mixed },
	},
	{ timestamps: true },
);

export const ExerciseModel = mongoose.model<IExercise, ExerciseModelType>(
	"Exercise",
	ExerciseSchema,
);
