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
	private getTodayRangeInUTC() {
		const now = new Date();
		const start = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
		);
		const end = new Date(start);
		end.setUTCDate(end.getUTCDate() + 1);
		end.setUTCMilliseconds(end.getUTCMilliseconds() - 1);
		return { start, end };
	}

	async getAllQuests() {
		return QuestModel.find().sort({ createdAt: -1 });
	}

	async generateDailyQuestsForUser(userId: string) {
		const userIdStr = userId.toString();
		const { start, end } = this.getTodayRangeInUTC();

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
		const { start, end } = this.getTodayRangeInUTC();

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

		const quest = await QuestModel.findById(id);
		if (!quest) throw new NotFoundException("Quest not found");

		const inUseCount = await DailyQuestModel.countDocuments({
			quest_id: id,
			is_completed: false,
		});
		if (inUseCount > 0) {
			throw new BadRequestException(
				`Cannot delete quest. It is still assigned to ${inUseCount} active daily quest(s).`,
			);
		}

		await QuestModel.findByIdAndDelete(id);
		return { message: "Deleted successfully" };
	}

	async checkAndCompleteDailyQuests(userId: string | Types.ObjectId) {
		const userIdStr = userId.toString();
		const { start, end } = this.getTodayRangeInUTC();

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
							$inc: { xp: quest.reward.amount, weekly_xp: quest.reward.amount },
						});
						break;
					case "heart":
						const userHeart =
							await UserModel.findById(userIdStr).select("hearts");
						if (!userHeart) break;

						const currentHearts = userHeart.hearts ?? 0;
						const maxHearts = 5;

						if (currentHearts < maxHearts) {
							const toAdd = Math.min(
								quest.reward.amount,
								maxHearts - currentHearts,
							);
							await UserModel.findByIdAndUpdate(userIdStr, {
								$inc: { hearts: toAdd },
							});
						}
						break;

					case "freeze":
						const user = await UserModel.findById(userIdStr);
						if ((user.freeze_count ?? 0) >= 2) break;

						const toAdd = Math.min(quest.reward.amount, 2 - user.freeze_count);
						if (toAdd > 0) {
							await UserModel.findByIdAndUpdate(userIdStr, {
								$inc: { freeze_count: toAdd },
							});
						}
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

	async getQuestDetail(id: string) {
		if (!Types.ObjectId.isValid(id)) throw new NotFoundException("Invalid ID");
		const quest = await QuestModel.findById(id);
		if (!quest) throw new NotFoundException("Quest not found");
		return quest;
	}
}
