import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { UserModel } from "src/db/models/user.model";
import { ShopItemType, ShopItemPrices } from "./constants/shop-items";
import { ShopTransactionModel } from "src/db/models/shop-transaction.model";

@Injectable()
export class ShopService {
	async purchase(userId: string, item: ShopItemType) {
		const user = await UserModel.findById(userId);
		if (!user) throw new NotFoundException("User not found");

		const price = ShopItemPrices[item];
		if (user.balance < price) {
			throw new BadRequestException("Không đủ gem");
		}

		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);

		const alreadyPurchasedToday = await ShopTransactionModel.exists({
			user: user._id,
			item,
			createdAt: { $gte: startOfToday },
		});

		if (alreadyPurchasedToday) {
			throw new BadRequestException("Bạn đã mua vật phẩm này hôm nay rồi");
		}

		switch (item) {
			case ShopItemType.STREAK_FREEZE:
				if (user.is_freeze) {
					throw new BadRequestException("Bạn đã có freeze đang hoạt động");
				}
				user.is_freeze = true;
				user.freeze_count += 1;
				break;

			case ShopItemType.DOUBLE_OR_NOTHING:
				if (user.double_or_nothing?.is_active) {
					throw new BadRequestException("Bạn đã tham gia thử thách rồi");
				}
				user.double_or_nothing = {
					start_date: new Date(),
					is_active: true,
					is_completed: false,
				};
				break;

			case ShopItemType.STREAK_REPAIR: {
				if (user.streak_days > 0) {
					throw new BadRequestException("Streak hiện tại chưa bị mất");
				}

				if (!user.backup_streak_days || user.backup_streak_days <= 0) {
					throw new BadRequestException("Không thể khôi phục streak");
				}

				user.streak_days = user.backup_streak_days;
				user.backup_streak_days = 0;
				break;
			}

			case ShopItemType.HEART_REFILL:
				user.hearts = 5;
				break;

			default:
				throw new BadRequestException("Item không hợp lệ");
		}

		user.balance -= price;
		await user.save();

		await ShopTransactionModel.create({
			user: user._id,
			item,
			price,
		});

		return {
			success: true,
			item,
			price,
			remaining_balance: user.balance,
		};
	}

	getAvailableItems(user) {
		return Object.entries(ShopItemPrices).map(([key, price]) => {
			const item = key as ShopItemType;
			let purchased = false;

			if (item === ShopItemType.STREAK_FREEZE && user.is_freeze)
				purchased = true;

			if (
				item === ShopItemType.DOUBLE_OR_NOTHING &&
				user.double_or_nothing?.is_active
			)
				purchased = true;

			return {
				item,
				price,
				purchased,
			};
		});
	}
}
