import { Injectable } from "@nestjs/common";
import { VnpayService } from "nestjs-vnpay";
import { ConfigService } from "@nestjs/config";
import { ProductCode, VnpLocale } from "vnpay";
import { UserModel } from "src/db/models/user.model";
import {
	TransactionModel,
	TransactionStatus,
} from "src/db/models/transaction.model";

@Injectable()
export class WalletService {
	constructor(
		private readonly vnpayService: VnpayService,
		private readonly configService: ConfigService,
	) {}

	createDepositUrl(
		userId: string,
		amount: number,
		ip: string,
		isMobile = false,
	): string {
		const txnRef = `${Date.now()}_${userId}`;
		const returnUrl = isMobile
			? this.configService.get<string>("VNP_RETURN_URL_MOBILE")!
			: this.configService.get<string>("VNP_RETURN_URL")!;

		return this.vnpayService.buildPaymentUrl({
			vnp_Amount: amount,
			vnp_TxnRef: txnRef,
			vnp_OrderInfo: "Nạp tiền vào tài khoản",
			vnp_IpAddr: ip || "127.0.0.1",
			vnp_OrderType: ProductCode.Other,
			vnp_Locale: VnpLocale.VN,
			vnp_ReturnUrl: returnUrl,
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

		const txnRef = query.vnp_TxnRef;
		const [_, userId] = txnRef.split("_");
		const rawAmount = parseInt(query.vnp_Amount || "0", 10);
		const amount = rawAmount / 100;
		const gemAmount = this.convertVndToGem(amount);

		if (!result.isVerified || !result.isSuccess || !userId || isNaN(amount)) {
			await TransactionModel.create({
				user: userId,
				vnd_amount: amount || 0,
				gem_amount: 0,
				status: TransactionStatus.FAILED,
				transaction_code: txnRef,
				message: "Xác minh thất bại hoặc dữ liệu không hợp lệ",
			});

			return {
				success: false,
				message: "Xác minh thất bại hoặc dữ liệu không hợp lệ",
			};
		}

		await UserModel.findByIdAndUpdate(userId, {
			$inc: { balance: gemAmount },
		});

		await TransactionModel.create({
			user: userId,
			vnd_amount: amount,
			gem_amount: gemAmount,
			status: TransactionStatus.SUCCESS,
			transaction_code: txnRef,
			message: "Nạp gem thành công",
		});

		return {
			success: true,
			userId,
			amountVND: amount,
			gemsAdded: gemAmount,
			message: `Bạn đã nạp ${amount}₫ và nhận được ${gemAmount} gem.`,
		};
	}

	private convertVndToGem(amount: number): number {
		return Math.floor((amount * 10) / 1000); // 1.000₫ = 10 gem
	}

	async getUserTransactions(userId: string) {
		return await TransactionModel.find({ user: userId })
			.sort({ createdAt: -1 })
			.select(
				"vnd_amount gem_amount status transaction_code createdAt message",
			);
	}
}
