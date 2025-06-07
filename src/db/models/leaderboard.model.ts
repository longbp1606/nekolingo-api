import mongoose, { Schema, HydratedDocument, Model } from "mongoose";

export interface ILeaderboard {
	week: number;
	rank: number;
	date_start: Date;
	date_end: Date;
}

export type LeaderboardDocument = HydratedDocument<ILeaderboard>;

export type LeaderboardModelType = Model<
	ILeaderboard,
	{},
	{},
	{},
	LeaderboardDocument
>;

const LeaderboardSchema = new Schema<ILeaderboard, LeaderboardModelType>(
	{
		week: { type: Number, required: true },
		rank: { type: Number, required: true },
		date_start: { type: Date, required: true },
		date_end: { type: Date, required: true },
	},
	{ timestamps: true },
);

export const LeaderboardModel = mongoose.model<
	ILeaderboard,
	LeaderboardModelType
>("Leaderboard", LeaderboardSchema);
