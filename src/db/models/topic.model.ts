import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface ITopic {
	title: string;
	order: number;
	description?: string;
}

export type TopicDocumentType = HydratedDocument<ITopic>;

export type TopicModelType = Model<ITopic, {}, {}, {}, TopicDocumentType>;

const TopicSchema = new Schema<ITopic, TopicModelType>(
	{
		title: { type: String, required: true },
		order: { type: Number, required: true },
		description: { type: String },
	},
	{ timestamps: true },
);

export const TopicModel = mongoose.model<ITopic, TopicModelType>(
	"Topic",
	TopicSchema,
);
