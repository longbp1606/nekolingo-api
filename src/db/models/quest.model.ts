import mongoose, { Schema, HydratedDocument, Model } from "mongoose";

export interface IQuest {
	title: string;
	icon: string;
	reward: number;
	condition: string;
}

export type QuestDocument = HydratedDocument<IQuest>;

export type QuestModelType = Model<IQuest, {}, {}, {}, QuestDocument>;

const QuestSchema = new Schema<IQuest, QuestModelType>(
	{
		title: { type: String, required: true },
		icon: { type: String, required: true },
		reward: { type: Number, required: true },
		condition: { type: String, required: true },
	},
	{ timestamps: true },
);

export const QuestModel = mongoose.model<IQuest, QuestModelType>(
	"Quest",
	QuestSchema,
);
