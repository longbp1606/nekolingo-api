import { Schema, model, Types, Document } from "mongoose";

export enum TransactionStatus {
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
}

export interface ITransaction {
	user: Types.ObjectId;
	vnd_amount: number;
	gem_amount: number;
	status: TransactionStatus;
	transaction_code: string;
	message?: string;
	createdAt?: Date;
}

export type TransactionDocument = Document & ITransaction;

const TransactionSchema = new Schema<ITransaction>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		vnd_amount: { type: Number, required: true },
		gem_amount: { type: Number, required: true },
		status: {
			type: String,
			enum: Object.values(TransactionStatus),
			required: true,
		},
		transaction_code: { type: String, required: true }, // vnp_TxnRef
		message: { type: String },
	},
	{ timestamps: true },
);

export const TransactionModel = model<ITransaction>(
	"Transaction",
	TransactionSchema,
);
