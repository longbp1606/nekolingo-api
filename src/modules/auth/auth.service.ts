import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import * as jwt from "jsonwebtoken";
import { Env } from "@utils";
import { ClsService } from "nestjs-cls";
import { BasicLoginRequest, BasicRegisterRequest } from "./dto";
import { UserModel } from "@db/models";
import { EmailNotFoundError, WrongPasswordError } from "./errors";
import * as bcrypt from "bcrypt";
import { ExistedEmailError } from "./errors/existed-email.error";

@Injectable()
export class AuthService {
	async issueTokenPair(userId: Types.ObjectId) {
		const accessToken = jwt.sign({}, Env.JWT_AT_SECRET, {
			subject: userId.toString(),
			expiresIn: Env.JWT_AT_EXPIRATION_TIME,
		});

		const refreshToken = jwt.sign({}, Env.JWT_RT_SECRET, {
			subject: userId.toString(),
			expiresIn: Env.JWT_RT_EXPIRATION_TIME,
		});

		return {
			accessToken,
			refreshToken,
		};
	}

	async verifyAccessToken(token: string) {
		const data = jwt.verify(token, Env.JWT_AT_SECRET);
		return typeof data == "string" ? null : data.sub;
	}

	async basicLogin(dto: BasicLoginRequest) {
		const user = await UserModel.findOne({ email: dto.email });
		if (!user) throw new EmailNotFoundError();
		if (!bcrypt.compareSync(dto.password, user.password))
			throw new WrongPasswordError();
		return this.issueTokenPair(user._id);
	}

	async basicRegister(dto: BasicRegisterRequest) {
		const existedEmail = await UserModel.findOne({ email: dto.email });
		if (existedEmail) throw new ExistedEmailError();
		const encryptedPassword = bcrypt.hashSync(dto.password, 10);
		await UserModel.create({
			...dto,
			password: encryptedPassword,
		});
	}
}
