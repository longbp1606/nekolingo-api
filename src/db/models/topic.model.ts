import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface ITopic {
	title: string;
	order: number;
	icon?: string;
	course: Types.ObjectId;
}

export type TopicDocumentType = HydratedDocument<ITopic>;

export type TopicModelType = Model<ITopic, {}, {}, {}, TopicDocumentType>;

const TopicSchema = new Schema<ITopic, TopicModelType>(
	{
		title: { type: String, required: true },
		order: { type: Number, required: true },
		icon: { type: String },
		course: {
			type: Schema.Types.ObjectId,
			ref: "Course",
			required: true,
		},
	},
	{ timestamps: true },
);

TopicSchema.index({ course: 1, order: 1 }, { unique: true });

export const TopicModel = mongoose.model<ITopic, TopicModelType>(
	"Topic",
	TopicSchema,
);
