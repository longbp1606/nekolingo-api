import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface IUserArchivement {
	user_id: mongoose.Schema.Types.ObjectId;
	archivement_id: mongoose.Schema.Types.ObjectId;
	unlock_at: Date;
}

export type UserArchivementDocumentType = HydratedDocument<IUserArchivement>;

export type UserArchivementModelType = Model<
	IUserArchivement,
	{},
	{},
	{},
	UserArchivementDocumentType
>;

const UserArchivementSchema = new Schema<
	IUserArchivement,
	UserArchivementModelType
>(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		archivement_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Archivement",
			required: true,
		},
		unlock_at: { type: Date, required: true },
	},
	{ timestamps: true },
);

export const UserArchivementModel = mongoose.model<
	IUserArchivement,
	UserArchivementModelType
>("UserArchivement", UserArchivementSchema);
