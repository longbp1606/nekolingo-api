import { Injectable } from "@nestjs/common";
import { CreateUserRequest } from "./dto";
import { ValidationError } from "class-validator";
import { UserModel } from "@db/models";
import { ApiValidationError } from "@errors";

@Injectable()
export class UserService {
	async validateBeforeCreate(dto: CreateUserRequest) {
		const errors: ValidationError[] = [];
		const [emailExisted] = await Promise.all([
			UserModel.exists({ email: dto.email }),
		]);

		if (emailExisted) {
			errors.push({
				property: "email",
				constraints: {
					emailExisted: "Email already existed",
				},
			});
		}

		if (errors.length > 0) {
			throw new ApiValidationError(errors);
		}
	}

	async createUser(dto: CreateUserRequest) {
		await this.validateBeforeCreate(dto);
		const user = new UserModel(dto);
		await user.save();
	}
}
