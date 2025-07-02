import { Injectable } from "@nestjs/common";
import { VnpayService } from "nestjs-vnpay";
import { ConfigService } from "@nestjs/config";
import { ProductCode, VnpLocale } from "vnpay";
import { UserModel } from "src/db/models/user.model";

@Injectable()
export class WalletService {
	constructor(
		private readonly vnpayService: VnpayService,
		private readonly configService: ConfigService,
	) {}

	createDepositUrl(userId: string, amount: number, ip: string): string {
		const txnRef = `${Date.now()}_${userId}`;

		return this.vnpayService.buildPaymentUrl({
			vnp_Amount: amount * 100,
			vnp_TxnRef: txnRef,
			vnp_OrderInfo: "Nap tien vao tai khoan",
			vnp_IpAddr: ip || "127.0.0.1",
			vnp_OrderType: ProductCode.Other,
			vnp_Locale: VnpLocale.VN,
			vnp_ReturnUrl: this.configService.get<string>("VNP_RETURN_URL")!,
		});
	}

	async handleReturn(query: Record<string, string>) {
		const requiredFields = [
			"vnp_TxnRef",
			"vnp_OrderInfo",
			"vnp_Amount",
			"vnp_ResponseCode",
			"vnp_SecureHash",
		];

		for (const field of requiredFields) {
			if (!query[field]) {
				return {
					success: false,
					message: `Thiếu trường ${field} trong phản hồi VNPAY`,
				};
			}
		}

		const result = await this.vnpayService.verifyReturnUrl(query as any);

		if (!result.isVerified || !result.isSuccess) {
			return {
				success: false,
				message: "Xác minh thất bại hoặc giao dịch lỗi",
			};
		}

		const txnRef = query.vnp_TxnRef;
		const [_, userId] = txnRef.split("_");
		const rawAmount = parseInt(query.vnp_Amount || "0", 10);
		const amount = rawAmount / 100;

		if (!userId || isNaN(amount)) {
			return { success: false, message: "Dữ liệu không hợp lệ" };
		}

		await UserModel.findByIdAndUpdate(userId, {
			$inc: { balance: amount },
		});

		return {
			success: true,
			userId,
			amount,
		};
	}
}
