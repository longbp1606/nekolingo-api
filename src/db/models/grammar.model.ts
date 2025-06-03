import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface IGrammar {
	grammar_id: string;
	name: string;
	description: string;
}

export type GrammarDocumentType = HydratedDocument<IGrammar>;

export type GrammarModelType = Model<IGrammar, {}, {}, {}, GrammarDocumentType>;

const GrammarSchema = new Schema<IGrammar, GrammarModelType>(
	{
		grammar_id: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
	},
	{ timestamps: true },
);

export const GrammarModel = mongoose.model<IGrammar, GrammarModelType>(
	"Grammar",
	GrammarSchema,
);
