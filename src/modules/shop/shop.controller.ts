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
	@ApiOperation({ summary: "Xem trạng thái shop hiện tại của user" })
	async getShopStatus(@Req() req: Request & { user?: { id: string } }) {
		const user = await UserModel.findById(req.user?.id);

		return {
			success: true,
			status: {
				is_freeze: user.is_freeze,
				hearts: user.hearts,
				streak_days: user.streak_days,
				double_or_nothing: user.double_or_nothing ?? null,
			},
		};
	}

	@Get("history")
	@ApiOperation({ summary: "Xem lịch sử mua item của user" })
	async getPurchaseHistory(@Req() req: Request & { user?: { id: string } }) {
		const transactions = await ShopTransactionModel.find({
			user: req.user?.id,
		})
			.sort({ createdAt: -1 })
			.select("item price createdAt");

		return { success: true, history: transactions };
	}
}
