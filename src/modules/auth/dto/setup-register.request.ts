import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	IsStrongPassword,
} from "class-validator";

export class SetupRegisterRequest {
	@ApiProperty({ example: "user@gmail.com" })
	@IsEmail()
	email: string;

	@ApiProperty({ example: "Abc@1234" })
	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	password: string;

	@ApiProperty({ example: "user1" })
	@IsOptional()
	username: string;

	@ApiProperty()
	@IsString()
	language_from: string;

	@ApiProperty()
	@IsString()
	language_to: string;

	@ApiProperty()
	@IsNumber()
	current_level: number;
}
