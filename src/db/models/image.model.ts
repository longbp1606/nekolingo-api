import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface IImage {
	publicId: string;
	url: string;
	originalName: string;
	folder: string;
	format: string;
	width: number;
	height: number;
	bytes: number;
}

export type ImageDocumentType = HydratedDocument<IImage>;

export type ImageModelType = Model<IImage, {}, {}, {}, ImageDocumentType>;

const ImageSchema = new Schema<IImage, ImageModelType>(
	{
		publicId: { type: String, required: true },
		url: { type: String, required: true },
		originalName: { type: String, required: true },
		folder: { type: String, required: true },
		format: { type: String, required: true },
		width: { type: Number, required: true },
		height: { type: Number, required: true },
		bytes: { type: Number, required: true },
	},
	{ timestamps: true },
);

export const ImageModel = mongoose.model<IImage, ImageModelType>(
	"Image",
	ImageSchema,
);
