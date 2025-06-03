import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface IVocabulary {
	vocabulary_id: string;
	word: string;
	pronunciation_us?: string;
	pronunciation_uk?: string;
	meaning: string;
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
		vocabulary_id: { type: String, required: true, unique: true },
		word: { type: String, required: true },
		pronunciation_us: { type: String },
		pronunciation_uk: { type: String },
		meaning: { type: String, required: true },
	},
	{ timestamps: true },
);

export const VocabularyModel = mongoose.model<IVocabulary, VocabularyModelType>(
	"Vocabulary",
	VocabularySchema,
);
