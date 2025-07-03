import {
	Controller,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	Req,
	UseGuards,
} from "@nestjs/common";
import {
	ApiTags,
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiBody,
} from "@nestjs/swagger";
import { AuthGuard } from "@modules/auth";
import { QuestService } from "./quest.service";
import { CreateQuestRequest } from "./dto/create-quest.request";

@ApiTags("Quest")
@ApiBearerAuth()
@Controller("quest")
export class QuestController {
	constructor(private readonly questService: QuestService) {}

	@Post("daily")
	@ApiOperation({ summary: "Tạo daily quest cho người dùng" })
	@UseGuards(AuthGuard)
	async generateDaily(@Req() req: any) {
		return this.questService.generateDailyQuestsForUser(req.user.id);
	}

	@Patch("daily/:id/complete")
	@ApiOperation({ summary: "Đánh dấu daily quest là đã hoàn thành" })
	@ApiParam({ name: "id", description: "ID của daily quest" })
	@UseGuards(AuthGuard)
	async complete(@Param("id") id: string, @Req() req: any) {
		return this.questService.completeQuest(req.user.id, id);
	}

	@Post()
	@ApiOperation({ summary: "Tạo quest mới (admin)" })
	@ApiBody({ type: CreateQuestRequest })
	@UseGuards(AuthGuard)
	async create(@Body() dto: CreateQuestRequest) {
		return this.questService.createQuest(dto);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Cập nhật quest (admin)" })
	@UseGuards(AuthGuard)
	async update(
		@Param("id") id: string,
		@Body() dto: Partial<CreateQuestRequest>,
	) {
		return this.questService.updateQuest(id, dto);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Xóa quest (admin)" })
	@UseGuards(AuthGuard)
	async delete(@Param("id") id: string) {
		return this.questService.deleteQuest(id);
	}
}
