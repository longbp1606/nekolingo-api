import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsOptional,
	IsStrongPassword,
	IsBoolean,
	IsDate,
	IsNumber,
	IsString,
} from "class-validator";

export class CreateUserRequest {
	@ApiProperty({ example: "user@gmail.com" })
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiProperty({ example: "User@123" })
	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	@IsOptional()
	password?: string;

	@ApiProperty({ example: 0 })
	@IsOptional()
	@IsNumber()
	role?: number;

	@ApiProperty({ example: "User" })
	@IsOptional()
	@IsString()
	username?: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	avatar_url?: string;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	current_level?: number;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	xp?: number;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	weekly_xp?: number;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	hearts?: number;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	streak_days?: number;

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	is_freeze?: boolean;

	@ApiProperty()
	@IsOptional()
	@IsDate()
	last_active_date?: Date;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	freeze_count?: number;

	@ApiProperty()
	@IsOptional()
	@IsString()
	language_from?: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	language_to?: string;

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	is_premiere?: boolean;
}
