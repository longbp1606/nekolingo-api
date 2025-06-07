import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface IVocabulary {
	word: string;
	meaning: string;
	language_from: Types.ObjectId;
	language_to: Types.ObjectId;
	type?: string;
}

export type VocabularyDocumentType = HydratedDocument<IVocabulary>;

export type VocabularyModelType = Model<
	IVocabulary,
	{},
	{},
	{},
	VocabularyDocumentType
>;

const VocabularySchema = new Schema<IVocabulary, VocabularyModelType>(
	{
		word: { type: String, required: true },
		meaning: { type: String, required: true },
		type: { type: String },
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

export const VocabularyModel = mongoose.model<IVocabulary, VocabularyModelType>(
	"Vocabulary",
	VocabularySchema,
);
