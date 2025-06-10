import { ApiError } from "@errors";

export class ExistedEmailError extends ApiError {
	constructor() {
		super({
			code: "existed_email",
			message: "Email already existed",
			status: 401,
			detail: null,
		});
	}
}
