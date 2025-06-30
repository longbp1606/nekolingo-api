import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { InvalidTokenError } from "./errors";
import { UserModel } from "@db/models";
import { ClsService } from "nestjs-cls";
import { NekolingoClsStore } from "@utils";
import { UserResponse } from "@modules/user/dto";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
		private readonly cls: ClsService<NekolingoClsStore>,
	) {}

	async canActivate(context: ExecutionContext) {
		const skipAuth =
			Reflect.getMetadata("skipAuth", context.getHandler()) ||
			Reflect.getMetadata("skipAuth", context.getClass());
		if (skipAuth) return true;

		const req = context.switchToHttp().getRequest<Request & { user?: any }>();

		const token = this.getTokenFromRequest(req);
		if (!token) throw new InvalidTokenError();

		const userId = await this.authService.verifyAccessToken(token);
		if (!userId) throw new InvalidTokenError();
		const user = await UserModel.findById(userId);
		this.cls.set("user", UserResponse.fromDocument(user));

		return true;
	}

	private getTokenFromRequest(request: Request) {
		const authorization = request.headers.authorization;
		if (!authorization || !authorization.startsWith("Bearer ")) return null;
		return authorization.split(" ")[1];
	}
}
