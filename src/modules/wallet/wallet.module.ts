import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
import { VnpayModule } from "nestjs-vnpay";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "@modules/auth";

@Module({
	imports: [
		ConfigModule,
		AuthModule,
		VnpayModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				tmnCode: config.get("VNP_TMNCODE"),
				secureSecret: config.get("VNP_HASH_SECRET"),
				returnUrl: config.get("VNP_RETURN_URL"),
				vnpayHost: "https://sandbox.vnpayment.vn",
				testMode: true,
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [WalletController],
	providers: [WalletService],
})
export class WalletModule {}
