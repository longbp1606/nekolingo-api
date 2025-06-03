import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface IArchivement {
	title: string;
	description: string;
	icon: string;
	condition: JSON;
}

export type ArchivementDocumentType = HydratedDocument<IArchivement>;

export type ArchivementModelType = Model<
	IArchivement,
	{},
	{},
	{},
	ArchivementDocumentType
>;

const ArchivementSchema = new Schema<IArchivement, ArchivementModelType>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		icon: { type: String, required: true },
		condition: { type: JSON, required: true },
	},
	{ timestamps: true },
);

export const ArchivementModel = mongoose.model<
	IArchivement,
	ArchivementModelType
>("Archivement", ArchivementSchema);
