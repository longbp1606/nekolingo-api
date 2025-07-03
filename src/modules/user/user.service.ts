import { Injectable } from "@nestjs/common";
import { CreateUserRequest } from "./dto";
import { ValidationError } from "class-validator";
import { UserModel } from "@db/models";
import { ApiValidationError } from "@errors";
import * as bcrypt from "bcrypt";
import { UpdateUserRequest } from "./dto/update-user.request";

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

	async getUsers() {
		return UserModel.find();
	}

	async getUserById(id: string) {
		return UserModel.findById(id);
	}

	async createUser(dto: CreateUserRequest) {
		await this.validateBeforeCreate(dto);
		const user = new UserModel({
			...dto,
			password: bcrypt.hashSync(dto.password, 10),
		});
		await user.save();
	}

	async updateUser(id: string, dto: UpdateUserRequest) {
		await UserModel.findByIdAndUpdate(id, dto);
	}

	async deleteUser(id: string) {
		await UserModel.findByIdAndDelete(id);
	}
}
