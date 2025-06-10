import { ApiError } from "@errors";

export class EmailNotFoundError extends ApiError {
	constructor() {
		super({
			code: "email_not_found",
			message: "Email not found",
			status: 404,
			detail: null,
		});
	}
}
