import mongoose, { Schema, Types, HydratedDocument, Model } from "mongoose";

export interface IUserTopicProgress {
	user_id: Types.ObjectId;
	topic_id: Types.ObjectId;
	proficiency_level: number;
	last_practiced_at?: Date;
}

export type UserTopicProgressDocument = HydratedDocument<IUserTopicProgress>;

const UserTopicProgressSchema = new Schema<IUserTopicProgress>(
	{
		user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		topic_id: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
		proficiency_level: { type: Number, required: true },
		last_practiced_at: { type: Date },
	},
	{ timestamps: true },
);

UserTopicProgressSchema.index({ user_id: 1, topic_id: 1 }, { unique: true });

export const UserTopicProgressModel = mongoose.model<IUserTopicProgress>(
	"UserTopicProgress",
	UserTopicProgressSchema,
);
