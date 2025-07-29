import { Controller, Get, Query, Req } from "@nestjs/common";
import {
	ApiTags,
	ApiOperation,
	ApiQuery,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { TransactionService } from "./transaction.service";
import { TransactionStatus } from "src/db/models/transaction.model";
import { Request } from "express";

@ApiTags("Transactions")
@ApiBearerAuth()
@Controller("transaction")
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Get("detail")
	@ApiOperation({
		summary: "Lấy chi tiết và đếm giao dịch theo status và thời gian",
	})
	@ApiQuery({ name: "status", enum: TransactionStatus })
	@ApiQuery({ name: "type", enum: ["day", "week", "month", "year"] })
	async getDetailAndCount(
		@Query("status") status: TransactionStatus,
		@Query("type") type: "day" | "week" | "month" | "year",
	) {
		return this.transactionService.getDetailAndCountByStatusAndPeriod(
			status,
			type,
		);
	}

	@Get("user-history")
	@ApiOperation({
		summary: "Lấy danh sách chi tiết giao dịch của người dùng hiện tại",
	})
	async getUserHistory(@Req() req: Request & { user?: { id: string } }) {
		const userId = req.user?.id;
		return this.transactionService.getUserTransactionList(userId);
	}

	@Get("total")
	@ApiOperation({
		summary: "Tính tổng tiền nạp thành công theo thời gian (admin)",
	})
	@ApiQuery({ name: "type", enum: ["day", "week", "month", "year"] })
	async getTotal(@Query("type") type: "day" | "week" | "month" | "year") {
		return this.transactionService.getTotalByPeriod(type);
	}
}
