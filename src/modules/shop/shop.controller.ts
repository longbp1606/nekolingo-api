import { Controller, Post, Get, Req, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { ShopService } from "./shop.service";
import { PurchaseItemDto } from "./dto/purchase-item.dto";
import { Request } from "express";
import { UserModel } from "src/db/models/user.model";
import { ShopTransactionModel } from "src/db/models/shop-transaction.model";

@ApiTags("Shop")
@ApiBearerAuth()
@Controller("shop")
export class ShopController {
	constructor(private readonly shopService: ShopService) {}

	@Post("buy")
	@ApiOperation({ summary: "Mua vật phẩm trong shop" })
	@ApiBody({ type: PurchaseItemDto })
	async buyItem(
		@Req() req: Request & { user?: { id: string } },
		@Body() body: PurchaseItemDto,
	) {
		const userId = req.user?.id;
		return this.shopService.purchase(userId, body.item);
	}

	@Get("items")
	@ApiOperation({ summary: "Lấy danh sách item shop có thể mua" })
	async getItems(@Req() req: Request & { user?: { id: string } }) {
		const user = await UserModel.findById(req.user?.id);
		const items = this.shopService.getAvailableItems(user);
		return { success: true, items };
	}

	@Get("status")
	@ApiOperation({ summary: "Xem trạng thái vật phẩm và lịch sử mua items" })
	async getShopStatus(@Req() req: Request & { user?: { id: string } }) {
		const user = await UserModel.findById(req.user?.id);

		const transactions = await ShopTransactionModel.find({ user: user._id })
			.sort({ createdAt: -1 })
			.select("item price createdAt");

		return {
			success: true,
			status: {
				freeze: {
					quantity: user.freeze_count,
					can_buy: user.freeze_count < 2,
				},
				double: {
					active: user.double_or_nothing?.is_active ?? false,
					can_buy: !(user.double_or_nothing?.is_active ?? false),
				},
				repair: {
					available: user.streak_days === 0 && user.backup_streak_days > 0,
					can_buy: true,
				},
			},
			history: transactions,
		};
	}
}
