import { ApiProperty } from "@nestjs/swagger";
import {
	IsEnum,
	IsInt,
	IsObject,
	IsOptional,
	IsString,
	Min,
	Max,
	ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { QuestType, RewardType } from "@db/models/quest.model";

class RewardDto {
	@ApiProperty({ example: "xp", enum: RewardType })
	@IsEnum(RewardType)
	type: RewardType;

	@ApiProperty({ example: 50 })
	@IsInt()
	@Min(1)
	amount: number;
}

export class CreateQuestRequest {
	@ApiProperty({ example: "Hoàn thành 1 bài học" })
	@IsString()
	title: string;

	@ApiProperty({ example: "https://example.com/icon.png" })
	@IsString()
	icon: string;

	@ApiProperty({ type: RewardDto })
	@IsObject()
	@ValidateNested()
	@Type(() => RewardDto)
	reward: RewardDto;

	@ApiProperty({ example: "Complete", enum: QuestType })
	@IsEnum(QuestType)
	type: QuestType;

	@ApiProperty({ example: 1, description: "Số bài học / phút / số lượng..." })
	@IsInt()
	@Min(1)
	condition: number;

	@ApiProperty({
		example: 80,
		required: false,
		description: "Chỉ dùng cho dạng quest Result (%)",
	})
	@IsOptional()
	@IsInt()
	@Min(0)
	@Max(100)
	score?: number;
}
