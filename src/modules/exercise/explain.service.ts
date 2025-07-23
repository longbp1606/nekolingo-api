import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { ExerciseModel } from "@db/models";
import { UserExerciseProgressModel } from "@db/models";
import { GeminiService } from "@modules/ai/gemini.service";
import { buildExplainAnswerPrompt } from "@modules/ai/prompt-templates";

@Injectable()
export class ExplainService {
	constructor(private readonly gemini: GeminiService) {}

	async explainAnswer(
		userId: string,
		exerciseId: string,
	): Promise<{
		explanation: string;
		grammar?: string;
		correct_answer: any;
		user_answer?: string;
		is_mistake: boolean;
	}> {
		const progress = await UserExerciseProgressModel.findOne({
			user_id: new Types.ObjectId(userId),
			exercise_id: new Types.ObjectId(exerciseId),
		});

		if (!progress) throw new Error("Không tìm thấy tiến trình của người học.");

		const exercise =
			await ExerciseModel.findById(exerciseId).populate("grammar");
		if (!exercise) throw new Error("Không tìm thấy bài tập.");

		const grammarName =
			typeof exercise.grammar === "object" && exercise.grammar !== null
				? (exercise.grammar as { name?: string })?.name
				: undefined;

		const prompt = buildExplainAnswerPrompt({
			question: exercise.question,
			correctAnswer: JSON.stringify(exercise.correct_answer),
			userAnswer: progress.user_answer ?? "",
			grammarName,
			isMistake: progress.is_mistake === true,
		});

		const explanation = await this.gemini.generateExplanation(prompt);

		return {
			explanation,
			grammar: grammarName,
			correct_answer: exercise.correct_answer,
			user_answer: progress.user_answer ?? "",
			is_mistake: progress.is_mistake === true,
		};
	}
}
