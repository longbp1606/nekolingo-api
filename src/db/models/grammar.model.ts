import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface IGrammar {
	name: string;
	description: string;
	condition: string;
}

export type GrammarDocumentType = HydratedDocument<IGrammar>;

export type GrammarModelType = Model<IGrammar, {}, {}, {}, GrammarDocumentType>;

const GrammarSchema = new Schema<IGrammar, GrammarModelType>(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		condition: { type: String, required: true },
	},
	{ timestamps: true },
);

export const GrammarModel = mongoose.model<IGrammar, GrammarModelType>(
	"Grammar",
	GrammarSchema,
);
