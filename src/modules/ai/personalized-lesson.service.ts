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
			.populate({
				path: "exercise_id",
				populate: { path: "lesson", model: "Lesson" },
			});

		if (!mistakenProgresses.length) {
			throw new Error("Không có lỗi sai nào để tạo bài học.");
		}

		const firstExercise = mistakenProgresses[0]?.exercise_id as any;
		const sourceLesson = firstExercise?.lesson as any;

		if (!sourceLesson?.topic) {
			throw new Error("Không xác định được topic của bài học gốc.");
		}

		const topicId = sourceLesson.topic;

		const mistakeSummary = mistakenProgresses
			.map((p, i) => {
				const ex = p.exercise_id as any;
				return `(${i + 1}) Câu hỏi: ${ex.question}\nCâu sai: ${p.user_answer}\nĐúng: ${ex.correct_answer}`;
			})
			.join("\n");

		const prompt = `
Người học đã làm sai các câu sau:
${mistakeSummary}

Hãy tạo một bài học cá nhân hoá với **15 câu hỏi** giúp người học luyện lại các lỗi sai trên.

🎯 Yêu cầu nội dung:
- Câu hỏi phải có **tính suy luận, logic**, không quá đơn giản hoặc chỉ cần nhớ lại.
- Mỗi câu nên buộc người học phải **hiểu ngữ cảnh, cấu trúc ngữ pháp hoặc ý nghĩa từ vựng** để trả lời chính xác.
- Câu hỏi nên phù hợp với trình độ **sơ cấp đến trung cấp** tiếng Anh.
- Nội dung câu hỏi và câu trả lời **dùng tiếng Anh**.

📚 Phân bố dạng câu hỏi:
Tạo **3 câu hỏi cho mỗi dạng** trong các dạng sau (tổng 15 câu):
1. **fill_in_blank** – Chọn từ đúng để điền vào chỗ trống
2. **match** – Nối hai cột nội dung tương ứng (như từ và nghĩa, hoặc chủ đề và ví dụ)
3. **reorder** – Xếp lại các mảnh ghép thành câu hoàn chỉnh
4. **multiple_choice** – Chọn đáp án đúng trong nhiều lựa chọn


📦 Trả về JSON với định dạng như sau:

{
  "title": "Tên bài học",
  "description": "Mô tả bài học",
  "exercises": [
    {
      "question_format": "fill_in_blank",
      "type": "vocabulary",
      "question": "He ___ to school by bike.",
      "options": ["goes", "went", "going", "gone"],
      "correct_answer": "goes"
    },
    {
      "question_format": "match",
      "type": "grammar",
      "question": "Match the phrases with their correct meanings.",
      "options": [
        { "id": "1", "left": "Break the ice", "right": "Make people feel more comfortable" },
        { "id": "2", "left": "Hit the sack", "right": "Go to sleep" }
      ],
      "correct_answer": [
        { "id": "1", "left": "Break the ice", "right": "Make people feel more comfortable" },
        { "id": "2", "left": "Hit the sack", "right": "Go to sleep" }
      ]
    },
    {
      "question_format": "reorder",
      "type": "grammar",
      "question": "Arrange the words to form a correct sentence.",
      "options": ["Although", "it", "was", "raining", "he", "went", "out"],
      "correct_answer": "Although it was raining, he went out"
    },
    {
      "question_format": "multiple_choice",
      "type": "grammar",
      "question": "Which sentence is grammatically correct?",
      "options": [
        "He don't like apples.",
        "He doesn't likes apples.",
        "He doesn't like apples.",
        "He not like apples."
      ],
      "correct_answer": "He doesn't like apples."
    }
  ]
}

Chỉ trả lại JSON, không cần giải thích.
`;

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

		return this.createLessonFromAiJson(parsed, userId, topicId);
	}

	private async createLessonFromAiJson(
		parsed: any,
		userId: string,
		topicId: string | Types.ObjectId,
	): Promise<string> {
		const maxOrderLesson = await LessonModel.findOne({ topic: topicId })
			.sort({ order: -1 })
			.select("order");

		const nextOrder = maxOrderLesson ? maxOrderLesson.order + 1 : 1;

		const lesson = await LessonModel.create({
			title: parsed.title || "Luyện tập AI",
			description: parsed.description || "",
			type: ["grammar"],
			mode: "personalized",
			order: nextOrder,
			xp_reward: 10,
			topic: new Types.ObjectId(topicId),
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
				type: ex.type || "grammar",
				question: ex.question,
				correct_answer: ex.correct_answer,
				options: ex.options,
				extra_data: { generated_by: "gemini" },
			})),
		);

		return lesson._id.toString();
	}
}
