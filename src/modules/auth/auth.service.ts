import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import * as jwt from "jsonwebtoken";
import { Env, NekolingoClsStore } from "@utils";
import { ClsService } from "nestjs-cls";
import { BasicLoginRequest, BasicRegisterRequest } from "./dto";
import {
	CourseModel,
	LanguageModel,
	LessonModel,
	TopicModel,
	UserModel,
} from "@db/models";
import { EmailNotFoundError, WrongPasswordError } from "./errors";
import * as bcrypt from "bcrypt";
import { ExistedEmailError } from "./errors/existed-email.error";
import { SetupRegisterRequest } from "./dto/setup-register.request";

@Injectable()
export class AuthService {
	constructor(private readonly cls: ClsService<NekolingoClsStore>) {}

	getProfileCls() {
		return this.cls.get("user");
	}

	async issueTokenPair(userId: Types.ObjectId, role: number) {
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
			role,
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
		return this.issueTokenPair(user._id, user.role);
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

	async setupRegister(dto: SetupRegisterRequest) {
		const existedEmail = await UserModel.findOne({ email: dto.email });
		if (existedEmail) throw new ExistedEmailError();
		const encryptedPassword = bcrypt.hashSync(dto.password, 10);

		const languageFrom = await LanguageModel.findOne({
			code: dto.language_from,
		});

		const languageTo = await LanguageModel.findOne({
			code: dto.language_to,
		});
		const currentCourse = await CourseModel.findOne({
			language_from: languageFrom._id,
			language_to: languageTo._id,
		});
		const currentTopic = await TopicModel.find({
			course: currentCourse._id,
		});
		const currentLesson = await LessonModel.find({
			topic: currentTopic.at(0)._id,
		});

		await UserModel.create({
			email: dto.email,
			password: encryptedPassword,
			role: 0,
			username: dto.username ? dto.username : dto.email.split("@")[0],
			current_level: dto.current_level,
			language_from: languageFrom._id,
			language_to: languageTo._id,
			is_active: true,
			current_course: currentCourse._id,
			current_topic: currentTopic[0]._id,
			current_lesson: currentLesson[0]._id,
		});
	}
}
