import { Injectable } from "@nestjs/common";
import { TopicModel } from "@db/models";
import { CreateTopicRequest, UpdateTopicRequest } from "./dto";
import { PaginationDto } from "@utils";

@Injectable()
export class TopicService {
	async createTopic(dto: CreateTopicRequest) {
		const topic = new TopicModel(dto);
		return await topic.save();
	}

	async getTopics(page: number = 1, take: number = 10) {
		const skip = (page - 1) * take;
		const [topics, total] = await Promise.all([
			TopicModel.find().sort({ order: 1 }).skip(skip).limit(take).exec(),
			TopicModel.countDocuments(),
		]);

		const pagination = new PaginationDto(page, take, total);
		return { topics, pagination };
	}

	async getTopicById(id: string) {
		return await TopicModel.findById(id);
	}

	async updateTopic(id: string, dto: UpdateTopicRequest) {
		return await TopicModel.findByIdAndUpdate(id, dto, { new: true });
	}

	async deleteTopic(id: string) {
		return await TopicModel.findByIdAndDelete(id);
	}
}
