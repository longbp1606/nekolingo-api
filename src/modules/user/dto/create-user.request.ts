import { UserDocumentType } from "@db/models";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";
import { UserResponse } from "./user.response";

export class CreateUserRequest {
	@ApiProperty({ example: "user@gmail.com" })
	@IsEmail()
	email: string;

	@ApiProperty({ example: "User@123" })
	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	password: string;

	@ApiProperty({ example: 0 })
	role?: number;

	@ApiProperty({ example: "User" })
	username?: string;

	@ApiProperty()
	avatar_url?: string;

	@ApiProperty()
	current_level?: number;

	@ApiProperty()
	xp?: number;

	@ApiProperty()
	weekly_xp?: number;

	@ApiProperty()
	hearts?: number;

	@ApiProperty()
	streak_days?: number;

	@ApiProperty()
	is_freeze?: boolean;

	@ApiProperty()
	last_active_date?: Date;

	@ApiProperty()
	freeze_count?: number;

	@ApiProperty()
	language_from?: string;

	@ApiProperty()
	language_to?: string;

	@ApiProperty()
	is_premiere?: boolean;
}
