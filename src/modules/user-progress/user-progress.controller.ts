import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserProgressService } from "./user-progress.service";
import { CompleteLessonRequest, UpdateStreakRequest } from "./dto";
import { GetLessonExercisesByModeRequest } from "./dto/get-lesson-exercises.request";
import { Types } from "mongoose";
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";

@ApiTags("User Progress")
@ApiBearerAuth()
@Controller("user-progress")
export class UserProgressController {
	constructor(private readonly userProgressService: UserProgressService) {}

	@Post("complete-lesson")
	@ApiOperation({
		summary: "Đánh dấu lesson đã hoàn thành và xử lý XP, streak, phục hồi tim",
	})
	@ApiBody({ type: CompleteLessonRequest })
	async completeLesson(@Body() dto: CompleteLessonRequest) {
		return this.userProgressService.completeLesson(dto);
	}

	@Post("update-streak")
	@ApiOperation({ summary: "Cập nhật streak của người dùng" })
	@ApiBody({ type: UpdateStreakRequest })
	async updateStreak(@Body() dto: UpdateStreakRequest) {
		const userObjectId = new Types.ObjectId(dto.user_id);
		return this.userProgressService.updateStreak(userObjectId);
	}

	@Get("heart-recovery-lesson/:userId")
	@ApiOperation({ summary: "Lấy 1 bài học hồi phục tim, ngẫu nhiên từ đã học" })
	@ApiParam({ name: "userId", description: "ID của người dùng" })
	async getHeartRecoveryLesson(@Param("userId") userId: string) {
		return this.userProgressService.getHeartRecoveryLesson(
			new Types.ObjectId(userId),
		);
	}

	@Post("lesson-exercises-by-mode")
	@ApiOperation({
		summary: "Lấy danh sách bài tập tương ứng với lesson theo mode",
	})
	@ApiBody({ type: GetLessonExercisesByModeRequest })
	async getLessonExercisesByMode(@Body() dto: GetLessonExercisesByModeRequest) {
		const userId = new Types.ObjectId(dto.user_id);
		const lessonId = new Types.ObjectId(dto.lesson_id);
		return this.userProgressService.getLessonExercisesByMode(userId, lessonId);
	}
}
