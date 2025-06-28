import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { InvalidTokenError } from "./errors";
import { UserModel } from "@db/models";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext) {
		const skipAuth =
			Reflect.getMetadata("skipAuth", context.getHandler()) ||
			Reflect.getMetadata("skipAuth", context.getClass());
		if (skipAuth) return true;

		const req = context.switchToHttp().getRequest<Request & { user?: any }>();

		const token = this.getTokenFromRequest(req);
		if (!token) throw new InvalidTokenError();

		const userId = await this.authService.verifyAccessToken(token);
		const user = await UserModel.findById(userId);
		if (!user) throw new InvalidTokenError();

		req.user = {
			id: user.id,
			email: user.email,
			role: user.role,
		};

		return true;
	}

	private getTokenFromRequest(request: Request) {
		const authorization = request.headers.authorization;
		if (!authorization || !authorization.startsWith("Bearer ")) return null;
		return authorization.split(" ")[1];
	}
}
