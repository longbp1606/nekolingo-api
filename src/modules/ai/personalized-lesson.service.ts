import { Injectable } from "@nestjs/common";
import {
	LessonModel,
	ExerciseModel,
	UserExerciseProgressModel,
} from "@db/models";
import { Types } from "mongoose";

@Injectable()
export class PersonalizedLessonService {
	async generateLessonFromMistakes(userId: string): Promise<string> {
		const objectId = new Types.ObjectId(userId);

		const mistakenProgresses = await UserExerciseProgressModel.find({
			user_id: objectId,
			is_mistake: true,
		})
			.sort({ completed_at: -1 })
			.limit(15);

		if (!mistakenProgresses.length) {
			throw new Error("Không có lỗi sai nào để tạo bài học.");
		}

		const exerciseIds = mistakenProgresses.map((p) => p.exercise_id);
		const exercises = await ExerciseModel.find({
			_id: { $in: exerciseIds },
		});

		const lesson = await LessonModel.create({
			name: "Luyện tập cá nhân",
			type: "vocabulary",
			mode: "personalized",
			exercises: exercises.map((ex) => ex._id),
			extra_data: {
				generated_from: "mistakes",
			},
		});

		return lesson._id.toString();
	}
}
