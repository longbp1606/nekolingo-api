import mongoose, { Schema, Types, HydratedDocument, Model } from "mongoose";

export interface IDailyQuest {
	user_id: Types.ObjectId;
	quest_id: Types.ObjectId;
	is_completed: boolean;
}

export type DailyQuestDocument = HydratedDocument<IDailyQuest>;

export type DailyQuestModelType = Model<
	IDailyQuest,
	{},
	{},
	{},
	DailyQuestDocument
>;

const DailyQuestSchema = new Schema<IDailyQuest, DailyQuestModelType>(
	{
		user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		quest_id: { type: Schema.Types.ObjectId, ref: "Quest", required: true },
		is_completed: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

export const DailyQuestModel = mongoose.model<IDailyQuest, DailyQuestModelType>(
	"DailyQuest",
	DailyQuestSchema,
);
