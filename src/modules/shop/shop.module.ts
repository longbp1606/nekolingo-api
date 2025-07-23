// src/modules/shop/shop.module.ts
import { Module } from "@nestjs/common";
import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";
import { UserModel } from "src/db/models/user.model";
import { getModelToken } from "@nestjs/mongoose";

@Module({
	controllers: [ShopController],
	providers: [
		ShopService,
		{ provide: getModelToken("User"), useValue: UserModel },
	],
})
export class ShopModule {}
