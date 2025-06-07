import mongoose, { Schema, Types, HydratedDocument, Model } from "mongoose";

export interface IWeeklyLeaderboard {
	leaderboard_id: Types.ObjectId;
	user_id: Types.ObjectId;
}

export type WeeklyLeaderboardDocument = HydratedDocument<IWeeklyLeaderboard>;

export type WeeklyLeaderboardModelType = Model<
	IWeeklyLeaderboard,
	{},
	{},
	{},
	WeeklyLeaderboardDocument
>;

const WeeklyLeaderboardSchema = new Schema<
	IWeeklyLeaderboard,
	WeeklyLeaderboardModelType
>(
	{
		leaderboard_id: {
			type: Schema.Types.ObjectId,
			ref: "Leaderboard",
			required: true,
		},
		user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true },
);

export const WeeklyLeaderboardModel = mongoose.model<
	IWeeklyLeaderboard,
	WeeklyLeaderboardModelType
>("WeeklyLeaderboard", WeeklyLeaderboardSchema);
