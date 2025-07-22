import { Injectable } from "@nestjs/common";
import {
	LessonModel,
	ExerciseModel,
	UserExerciseProgressModel,
	UserLessonProgressModel,
} from "@db/models";
import { Types } from "mongoose";
import { GeminiService } from "@modules/ai/gemini.service";

@Injectable()
export class PersonalizedLessonService {
	constructor(private readonly geminiService: GeminiService) {}

	async autoGenerateIfNeeded(userId: string): Promise<boolean> {
		const objectId = new Types.ObjectId(userId);

		const lessons = await UserLessonProgressModel.find({
			user_id: objectId,
			completed_at: { $ne: null },
			used_in_personalized: { $ne: true },
		})
			.sort({ completed_at: -1 })
			.limit(3);

		if (lessons.length < 3) return false;

		const mistakes = await UserExerciseProgressModel.find({
			user_id: objectId,
			is_mistake: true,
		})
			.sort({ completed_at: -1 })
			.limit(15);

		if (!mistakes.length) return false;

		const lessonId = await this.generateLessonFromMistakes(userId);

		const usedLessonIds = lessons.map((l) => l.lesson_id);
		await UserLessonProgressModel.updateMany(
			{ user_id: objectId, lesson_id: { $in: usedLessonIds } },
			{ $set: { used_in_personalized: true } },
		);

		return true;
	}

	private extractJson(text: string): string {
		const match = text.match(/```json([\s\S]*?)```/);
		return match ? match[1].trim() : text.trim();
	}

	async generateLessonFromMistakes(userId: string): Promise<string> {
		const objectId = new Types.ObjectId(userId);

		const mistakenProgresses = await UserExerciseProgressModel.find({
			user_id: objectId,
			is_mistake: true,
		})
			.sort({ completed_at: -1 })
			.limit(10)
			.populate("exercise_id");

		if (!mistakenProgresses.length) {
			throw new Error("Không có lỗi sai nào để tạo bài học.");
		}

		const mistakeSummary = mistakenProgresses
			.map((p, i) => {
				const ex = p.exercise_id as any;
				return `(${i + 1}) Câu hỏi: ${ex.question}\nCâu sai: ${p.user_answer}\nĐúng: ${ex.correct_answer}`;
			})
			.join("\n");

		const prompt = `
Người học đã làm sai các câu sau:
${mistakeSummary}

Hãy tạo một bài học cá nhân hoá với khoảng 15 câu hỏi giúp người học luyện lại những lỗi sai trên.
Dạng bài nên dùng: fill_in_blank hoặc multiple_choice.
Trả kết quả JSON với cấu trúc:

{
  "title": "...",
  "description": "...",
  "exercises": [
    {
      "question_format": "fill_in_blank",
      "question": "...",
      "correct_answer": "...",
      "options": ["...", "...", "...", "..."]
    },
    ...
  ]}`;

		const response = await this.geminiService.generateExplanation(prompt);
		const cleanJson = this.extractJson(response);

		let parsed;
		try {
			parsed = JSON.parse(cleanJson);
		} catch (e) {
			throw new Error("AI trả kết quả không hợp lệ: " + response);
		}

		if (!Array.isArray(parsed.exercises) || parsed.exercises.length === 0) {
			throw new Error("AI không trả về danh sách bài tập hợp lệ");
		}

		return this.createLessonFromAiJson(parsed, userId);
	}

	private async createLessonFromAiJson(
		parsed: any,
		userId: string,
	): Promise<string> {
		const lesson = await LessonModel.create({
			title: parsed.title || "Luyện tập AI",
			description: parsed.description || "",
			type: ["grammar"],
			mode: "personalized",
			order: 1,
			xp_reward: 10,
			topic: new Types.ObjectId(),
			extra_data: {
				generated_from: "ai_bulk_mistakes",
				user_id: userId,
				language: "vi",
			},
		});

		await ExerciseModel.insertMany(
			parsed.exercises.map((ex: any) => ({
				lesson: lesson._id,
				question_format: ex.question_format,
				question: ex.question,
				correct_answer: ex.correct_answer,
				options: ex.options,
				type: "grammar",
				extra_data: { generated_by: "gemini" },
			})),
		);

		return lesson._id.toString();
	}
}
