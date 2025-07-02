import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserProgressService } from "./user-progress.service";
import { CompleteLessonRequest, UpdateStreakRequest } from "./dto";
import { Types } from "mongoose";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("User Progress")
@ApiBearerAuth()
@Controller("user-progress")
export class UserProgressController {
	constructor(private readonly userProgressService: UserProgressService) {}

	@Post("complete-lesson")
	async completeLesson(@Body() dto: CompleteLessonRequest) {
		return this.userProgressService.completeLesson(dto);
	}

	@Post("update-streak")
	async updateStreak(@Body() dto: UpdateStreakRequest) {
		const userObjectId = new Types.ObjectId(dto.user_id);
		return this.userProgressService.updateStreak(userObjectId);
	}

	@Get("heart-recovery-lesson/:userId")
	async getHeartRecoveryLesson(@Param("userId") userId: string) {
		return this.userProgressService.getHeartRecoveryLesson(
			new Types.ObjectId(userId),
		);
	}
}
