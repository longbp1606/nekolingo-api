import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface IExercise {
	type: string;
	question: string;
	correct_answer: string;
	options?: string[];
	audio_url?: string;
	image_url?: string;
	lesson: Types.ObjectId;
	vocabulary?: Types.ObjectId;
	grammar?: Types.ObjectId;
}

export type ExerciseDocument = HydratedDocument<IExercise>;

export type ExerciseModelType = Model<IExercise, {}, {}, {}, ExerciseDocument>;

const ExerciseSchema = new Schema<IExercise, ExerciseModelType>(
	{
		type: { type: String, required: true },
		question: { type: String, required: true },
		correct_answer: { type: String, required: true },
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
	},
	{ timestamps: true },
);

export const ExerciseModel = mongoose.model<IExercise, ExerciseModelType>(
	"Exercise",
	ExerciseSchema,
);

export { ExerciseSchema };
