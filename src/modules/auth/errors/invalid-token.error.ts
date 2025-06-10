import { ApiError } from "@errors";

export class InvalidTokenError extends ApiError {
	constructor() {
		super({
			message: "Invalid token",
			code: "invalid_token",
			status: 401,
			detail: null,
		});
	}
}
