import { Injectable } from "@nestjs/common";
import {
	TransactionModel,
	TransactionStatus,
} from "src/db/models/transaction.model";
import { Types } from "mongoose";

@Injectable()
export class TransactionService {
	async getDetailAndCountByStatusAndPeriod(
		status: TransactionStatus,
		type: "day" | "week" | "month" | "year",
	) {
		const now = new Date();
		let start: Date;

		switch (type) {
			case "day":
				start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				break;
			case "week":
				start = new Date(now);
				start.setDate(now.getDate() - now.getDay());
				break;
			case "month":
				start = new Date(now.getFullYear(), now.getMonth(), 1);
				break;
			case "year":
				start = new Date(now.getFullYear(), 0, 1);
				break;
		}

		const transactions = await TransactionModel.find({
			status,
			createdAt: { $gte: start },
		}).sort({ createdAt: -1 });

		const count = await TransactionModel.countDocuments({
			status,
			createdAt: { $gte: start },
		});

		return { count, transactions };
	}

	async getUserTransactionList(userId: string) {
		return await TransactionModel.find({
			user: new Types.ObjectId(userId),
		})
			.sort({ createdAt: -1 })
			.select(
				"vnd_amount gem_amount status transaction_code message createdAt",
			);
	}

	async getTotalByPeriod(type: "day" | "week" | "month" | "year") {
		const now = new Date();
		let start: Date;

		switch (type) {
			case "day":
				start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				break;
			case "week":
				start = new Date(now);
				start.setDate(now.getDate() - now.getDay());
				break;
			case "month":
				start = new Date(now.getFullYear(), now.getMonth(), 1);
				break;
			case "year":
				start = new Date(now.getFullYear(), 0, 1);
				break;
		}

		const result = await TransactionModel.aggregate([
			{
				$match: {
					createdAt: { $gte: start },
					status: TransactionStatus.SUCCESS,
				},
			},
			{
				$group: {
					_id: null,
					totalVnd: { $sum: "$vnd_amount" },
					totalGem: { $sum: "$gem_amount" },
				},
			},
		]);

		return result[0] || { totalVnd: 0, totalGem: 0 };
	}
}
