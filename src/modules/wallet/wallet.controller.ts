import { Controller, Get, Post, Req, Res, Body, Query } from "@nestjs/common";
import { Request, Response } from "express";
import { WalletService } from "./wallet.service";
import { CreateDepositRequest } from "./dto";
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger";
import { SkipAuth } from "@modules/auth";

@ApiTags("Wallet")
@ApiBearerAuth()
@Controller("wallet")
export class WalletController {
	constructor(private readonly walletService: WalletService) {}

	@Post("vnpay/deposit")
	@ApiOperation({ summary: "Tạo yêu cầu nạp tiền VNPAY (trả về URL)" })
	@ApiBody({ type: CreateDepositRequest })
	async deposit(
		@Req() req: Request & { user?: { id: string } },
		@Body() body: CreateDepositRequest,
		@Res() res: Response,
	) {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ message: "Unauthorized" });

		const paymentUrl = this.walletService.createDepositUrl(
			userId,
			body.amount,
			req.ip,
		);

		return res.json({ url: paymentUrl });
	}

	@Get("vnpay/return")
	@SkipAuth()
	@ApiOperation({ summary: "Xử lý callback từ VNPAY sau khi thanh toán" })
	async handleReturn(
		@Query() query: Record<string, string>,
		@Res() res: Response,
	) {
		const result = await this.walletService.handleReturn(query);

		if (result.success) {
			return res.json({
				success: true,
				message: `Nạp thành công`,
				amountVND: result.amountVND,
				gemsAdded: result.gemsAdded,
			});
		} else {
			return res.status(400).json({
				success: false,
				message: result.message || "Giao dịch không hợp lệ",
			});
		}
	}

	@Get("transactions")
	@ApiOperation({ summary: "Lấy lịch sử giao dịch của người dùng" })
	async getTransactionHistory(
		@Req() req: Request & { user?: { id: string } },
		@Res() res: Response,
	) {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ message: "Unauthorized" });

		const transactions = await this.walletService.getUserTransactions(userId);

		return res.json({ success: true, data: transactions });
	}
}
