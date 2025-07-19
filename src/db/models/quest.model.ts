import mongoose, { Schema, HydratedDocument, Model } from "mongoose";

export enum QuestType {
	Complete = "Complete",
	Time = "Time",
	Result = "Result",
	XP = "XP",
}

export enum RewardType {
	XP = "xp",
	Heart = "heart",
	Freeze = "freeze",
	Gem = "gem",
}

export interface IQuest {
	title: string;
	icon: string;
	reward: {
		type: RewardType;
		amount: number;
	};
	type: QuestType;
	condition: number;
	score?: number; // chỉ dùng cho Result quest (%)
}

export type QuestDocument = HydratedDocument<IQuest>;

export type QuestModelType = Model<IQuest, {}, {}, {}, QuestDocument>;

const QuestSchema = new Schema<IQuest, QuestModelType>(
	{
		title: { type: String, required: true },
		icon: { type: String, required: true },

		reward: {
			type: {
				type: String,
				enum: Object.values(RewardType),
				required: true,
			},
			amount: { type: Number, required: true },
		},

		type: {
			type: String,
			enum: Object.values(QuestType),
			required: true,
		},
		condition: { type: Number, required: true },
		score: { type: Number, required: false },
	},
	{ timestamps: true },
);

export const QuestModel = mongoose.model<IQuest, QuestModelType>(
	"Quest",
	QuestSchema,
);
