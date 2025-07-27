import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import {
	DailyQuestModel,
	QuestModel,
	UserModel,
	UserStreakProgressModel,
	UserLessonProgressModel,
	UserExerciseProgressModel,
} from "@db/models";
import { CreateQuestRequest } from "./dto/create-quest.request";
import { Types } from "mongoose";

@Injectable()
export class QuestService {
	private getTodayRangeInUTC_GMT7() {
		const now = new Date();
		const start = new Date(
			Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), -7, 0, 0),
		);
		const end = new Date(
			Date.UTC(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				16,
				59,
				59,
				999,
			),
		);
		return { start, end };
	}

	async getAllQuests() {
		return QuestModel.find().sort({ createdAt: -1 });
	}

	async generateDailyQuestsForUser(userId: string) {
		const userIdStr = userId.toString();
		const { start, end } = this.getTodayRangeInUTC_GMT7();

		const existing = await DailyQuestModel.find({
			user_id: userIdStr,
			createdAt: { $gte: start, $lte: end },
		}).sort({ createdAt: -1 });

		if (existing.length >= 3) {
			return existing.slice(0, 3);
		}

		const needCount = 3 - existing.length;

		const quests = await QuestModel.aggregate([
			{ $sample: { size: needCount } },
		]);

		const newQuests = quests.map((q) => ({
			user_id: userIdStr,
			quest_id: q._id,
			is_completed: false,
		}));

		const inserted = await DailyQuestModel.insertMany(newQuests);

		return [...existing, ...inserted];
	}

	async getDailyQuestsForUser(userId: string) {
		const userIdStr = userId.toString();
		const { start, end } = this.getTodayRangeInUTC_GMT7();

		const dailyQuests = await DailyQuestModel.find({
			user_id: userIdStr,
			createdAt: { $gte: start, $lte: end },
		})
			.sort({ createdAt: -1 })
			.limit(3)
			.populate("quest_id")
			.lean();

		const [lessons, exercises] = await Promise.all([
			UserLessonProgressModel.find({
				user_id: userIdStr,
				completed_at: { $gte: start, $lte: end },
			}),
			UserExerciseProgressModel.find({
				user_id: userIdStr,
				completed_at: { $gte: start, $lte: end },
			}),
		]);

		const result = dailyQuests.map((dq) => {
			const quest = dq.quest_id as any;
			let progress = 0;

			switch (quest.type) {
				case "Complete":
					progress = lessons.length;
					break;

				case "Time":
					const totalSeconds = exercises.reduce(
						(sum, ex) => sum + (ex.answer_time ?? 0),
						0,
					);
					progress = Math.floor(totalSeconds / 60);
					break;

				case "Result":
					const validLessons = lessons.filter(
						(l) => (l.score ?? 0) >= quest.score,
					);
					progress = validLessons.length;
					break;

				case "XP":
					progress = lessons.reduce((sum, l) => sum + (l.xp_earned ?? 0), 0);
					break;
			}

			return {
				...dq,
				quest_id: {
					...quest,
					progress,
					progress_text: `${progress}/${quest.condition}`,
				},
			};
		});

		return result;
	}

	async completeQuest(userId: string, questId: string) {
		return DailyQuestModel.findOneAndUpdate(
			{ _id: questId, user_id: userId },
			{ is_completed: true },
			{ new: true },
		);
	}

	async createQuest(dto: CreateQuestRequest) {
		if (
			dto.type === "Result" &&
			(dto.score === undefined || dto.score < 0 || dto.score > 100)
		) {
			throw new BadRequestException(
				"Score must be between 0-100 for Result quest",
			);
		}
		return QuestModel.create(dto);
	}

	async updateQuest(id: string, dto: Partial<CreateQuestRequest>) {
		if (!Types.ObjectId.isValid(id)) throw new NotFoundException("Invalid ID");
		const updated = await QuestModel.findByIdAndUpdate(id, dto, { new: true });
		if (!updated) throw new NotFoundException("Quest not found");
		return updated;
	}

	async deleteQuest(id: string) {
		if (!Types.ObjectId.isValid(id)) throw new NotFoundException("Invalid ID");
		const deleted = await QuestModel.findByIdAndDelete(id);
		if (!deleted) throw new NotFoundException("Quest not found");
		return { message: "Deleted successfully" };
	}

	async checkAndCompleteDailyQuests(userId: string | Types.ObjectId) {
		const userIdStr = userId.toString();
		const { start, end } = this.getTodayRangeInUTC_GMT7();

		const dailyQuests = await DailyQuestModel.find({
			user_id: userIdStr,
			is_completed: false,
			createdAt: { $gte: start, $lte: end },
		}).populate("quest_id");

		const [lessons, exercises] = await Promise.all([
			UserLessonProgressModel.find({
				user_id: userIdStr,
				completed_at: { $gte: start, $lte: end },
			}),
			UserExerciseProgressModel.find({
				user_id: userIdStr,
				completed_at: { $gte: start, $lte: end },
			}),
		]);

		for (const dq of dailyQuests) {
			const quest = dq.quest_id as any;
			if (!quest) continue;

			let isCompleted = false;

			switch (quest.type) {
				case "Complete":
					isCompleted = lessons.length >= quest.condition;
					break;

				case "Time":
					const totalSeconds = exercises.reduce(
						(sum, ex) => sum + (ex.answer_time ?? 0),
						0,
					);
					const totalMinutes = Math.floor(totalSeconds / 60);
					isCompleted = totalMinutes >= quest.condition;
					break;

				case "Result":
					const validLessons = lessons.filter(
						(l) => (l.score ?? 0) >= quest.score,
					);
					isCompleted = validLessons.length >= quest.condition;
					break;

				case "XP":
					const totalXP = lessons.reduce(
						(sum, l) => sum + (l.xp_earned ?? 0),
						0,
					);
					isCompleted = totalXP >= quest.condition;
					break;
			}

			if (isCompleted) {
				const updated = await DailyQuestModel.findOneAndUpdate(
					{ _id: dq._id, is_completed: false },
					{ is_completed: true },
					{ new: true },
				);

				if (!updated) continue;

				switch (quest.reward?.type) {
					case "xp":
						await UserModel.findByIdAndUpdate(userIdStr, {
							$inc: {
								xp: quest.reward.amount,
								weekly_xp: quest.reward.amount,
							},
						});
						break;

					case "heart":
						await UserModel.findByIdAndUpdate(userIdStr, {
							$inc: { hearts: quest.reward.amount },
						});
						break;

					case "freeze":
						await UserStreakProgressModel.updateOne(
							{ userId: userIdStr, date: new Date() },
							{ isFreeze: true },
							{ upsert: true },
						);
						break;

					case "gem":
						await UserModel.findByIdAndUpdate(userIdStr, {
							$inc: { gems: quest.reward.amount },
						});
						break;
				}
			}
		}
	}
}
