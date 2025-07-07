import { Injectable, NotFoundException } from "@nestjs/common";
import { DailyQuestModel, QuestModel } from "@db/models";
import { CreateQuestRequest } from "./dto/create-quest.request";
import { Types } from "mongoose";

@Injectable()
export class QuestService {
	async generateDailyQuestsForUser(userId: string) {
		const quests = await QuestModel.aggregate([{ $sample: { size: 3 } }]);
		return DailyQuestModel.insertMany(
			quests.map((q) => ({
				user_id: userId,
				quest_id: q._id,
				is_completed: false,
			})),
		);
	}

	async getDailyQuestsForUser(userId: string) {
		return DailyQuestModel.find({ user_id: userId }).populate("quest_id");
	}

	async completeQuest(userId: string, questId: string) {
		return DailyQuestModel.findOneAndUpdate(
			{ _id: questId, user_id: userId },
			{ is_completed: true },
			{ new: true },
		);
	}
	async createQuest(dto: CreateQuestRequest) {
		return await QuestModel.create(dto);
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
}
