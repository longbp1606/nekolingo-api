import { Schema, model, Types, Document } from "mongoose";
import { ShopItemType } from "@modules/shop/constants/shop-items";

export interface IShopTransaction {
	user: Types.ObjectId;
	item: ShopItemType;
	price: number;
	createdAt?: Date;
}

export type ShopTransactionDocument = Document & IShopTransaction;

const ShopTransactionSchema = new Schema<IShopTransaction>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		item: { type: String, enum: Object.values(ShopItemType), required: true },
		price: { type: Number, required: true },
	},
	{ timestamps: true },
);

export const ShopTransactionModel = model<IShopTransaction>(
	"ShopTransaction",
	ShopTransactionSchema,
);
