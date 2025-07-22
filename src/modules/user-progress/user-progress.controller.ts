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
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { SubmitExerciseDto } from "./dto/submit-exercise.dto";
import { CompleteFullLessonDto } from "./dto/complete-full-lesson.dto";
import { UserStreakService } from "@modules/user-streak/user-streak.service";
import { ExplainAnswerResponseDto } from "./dto/explain-answer.response";
import { ExplainAnswerRequestDto } from "./dto/explain-answer.request";
import { LessonModel, UserLessonProgressModel } from "@db/models";

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

	@Post("explain-answer")
	@ApiOperation({
		summary: "Giải thích vì sao người học đúng/sai một câu bài tập",
	})
	@ApiResponse({ type: ExplainAnswerResponseDto })
	async explainAnswer(
		@Body() dto: ExplainAnswerRequestDto,
	): Promise<ExplainAnswerResponseDto> {
		return this.userProgressService.explainAnswer(dto.user_id, dto.exercise_id);
	}

	@Post("generate-personalized-lesson")
	@ApiOperation({
		summary:
			"Tạo bài học cá nhân hóa nếu đủ điều kiện (3 bài + có sai) (Test thủ công)",
	})
	@ApiBody({ schema: { example: { user_id: "..." } } })
	async generatePersonalizedLessonIfEligible(@Body("user_id") userId: string) {
		return this.userProgressService.generatePersonalizedLessonIfEligible(
			userId,
		);
	}

	@Get("personalized-lessons/:userId")
	@ApiOperation({
		summary: "Lấy danh sách lesson cá nhân hoá đã được tạo từ lỗi sai (AI tạo)",
	})
	async getPersonalizedLessons(@Param("userId") userId: string) {
		const lessons = await LessonModel.find({
			mode: "personalized",
			"extra_data.generated_from": "ai_bulk_mistakes",
			"extra_data.user_id": userId,
		});

		return lessons;
	}
}
