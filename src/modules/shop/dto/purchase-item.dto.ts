import { IsEnum } from "class-validator";
import { ShopItemType } from "../constants/shop-items";
import { ApiProperty } from "@nestjs/swagger";

export class PurchaseItemDto {
	@ApiProperty({
		description: "Tên vật phẩm muốn mua",
		enum: ShopItemType,
		example: ShopItemType.STREAK_FREEZE,
	})
	@IsEnum(ShopItemType)
	item: ShopItemType;
}
