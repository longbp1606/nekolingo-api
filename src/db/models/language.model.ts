import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface ILanguage {
	name: string;
	code: string;
	flag_url?: string;
}

export type LanguageDocument = HydratedDocument<ILanguage>;

export type LanguageModelType = Model<ILanguage, {}, {}, {}, LanguageDocument>;

const LanguageSchema = new Schema<ILanguage, LanguageModelType>(
	{
		name: { type: String, required: true },
		code: { type: String, required: true, unique: true },
		flag_url: { type: String, required: false },
	},
	{
		timestamps: true,
	},
);

export const LanguageModel = mongoose.model<ILanguage, LanguageModelType>(
	"Language",
	LanguageSchema,
);

export { LanguageSchema };
