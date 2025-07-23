export enum ShopItemType {
	STREAK_FREEZE = "STREAK_FREEZE",
	DOUBLE_OR_NOTHING = "DOUBLE_OR_NOTHING",
	STREAK_REPAIR = "STREAK_REPAIR",
	HEART_REFILL = "HEART_REFILL",
}

export const ShopItemPrices: Record<ShopItemType, number> = {
	[ShopItemType.STREAK_FREEZE]: 50,
	[ShopItemType.DOUBLE_OR_NOTHING]: 50,
	[ShopItemType.STREAK_REPAIR]: 100,
	[ShopItemType.HEART_REFILL]: 30,
};
