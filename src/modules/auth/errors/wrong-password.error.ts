import { ApiError } from "@errors";

export class WrongPasswordError extends ApiError {
	constructor() {
		super({
			code: "wrong-password",
			message: "Wrong password",
			status: 401,
			detail: null,
		});
	}
}
