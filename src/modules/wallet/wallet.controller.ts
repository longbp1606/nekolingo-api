import { Controller, Get, Post, Req, Res, Body, Query } from "@nestjs/common";
import { Request, Response } from "express";
import { WalletService } from "./wallet.service";
import { CreateDepositRequest } from "./dto";
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger";

@ApiTags("Wallet")
@ApiBearerAuth()
@Controller("wallet")
export class WalletController {
	constructor(private readonly walletService: WalletService) {}

	@Post("vnpay/deposit")
	@ApiOperation({ summary: "Tạo yêu cầu nạp tiền VNPAY" })
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
		return res.redirect(paymentUrl);
	}

	@Get("vnpay/return")
	@ApiOperation({ summary: "Callback từ VNPAY sau khi nạp tiền" })
	async handleReturn(
		@Query() query: Record<string, string>,
		@Res() res: Response,
	) {
		console.log("📥 Dữ liệu trả về từ VNPAY:", query); // ✅ Log dữ liệu trả về

		const result = await this.walletService.handleReturn(query);

		console.log("✅ Kết quả xử lý:", result); // ✅ Log kết quả xử lý

		return res.send(
			result.success
				? `Nạp tiền thành công. Số tiền: ${result.amount} VND`
				: `Giao dịch không hợp lệ: ${result.message || "Unknown error"}`,
		);
	}
}
