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
import { SubmitExerciseDto } from "./dto/submit-exercise.dto";
import { CompleteFullLessonDto } from "./dto/complete-full-lesson.dto";
import { UserStreakService } from "@modules/user-streak/user-streak.service";

@ApiTags("User Progress")
@ApiBearerAuth()
@Controller("user-progress")
export class UserProgressController {
	constructor(
		private readonly userProgressService: UserProgressService,
		private readonly userStreakService: UserStreakService,
	) {}

	@Post("update-streak")
	@ApiOperation({ summary: "Cập nhật streak của người dùng" })
	@ApiBody({ type: UpdateStreakRequest })
	async updateStreak(@Body() dto: UpdateStreakRequest) {
		const userObjectId = new Types.ObjectId(dto.user_id);
		return this.userStreakService.updateStreak(userObjectId);
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
	@Post("submit-exercise")
	@ApiOperation({
		summary: "Nộp kết quả mỗi câu bài tập, lưu metadata sai/đúng",
	})
	@ApiBody({ type: SubmitExerciseDto })
	async submitExercise(@Body() dto: SubmitExerciseDto) {
		return this.userProgressService.submitExercise(dto);
	}

	@Post("complete-full-lesson")
	@ApiOperation({ summary: "Nộp toàn bộ bài học, ghi nhận bài tập và cộng XP" })
	@ApiBody({ type: CompleteFullLessonDto })
	async completeFullLesson(@Body() dto: CompleteFullLessonDto) {
		return this.userProgressService.completeFullLesson(dto);
	}
}
