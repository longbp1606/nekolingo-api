import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export class BasicLoginRequest {
	@ApiProperty({ example: "user1@gmail.com" })
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
}
