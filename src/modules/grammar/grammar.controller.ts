import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GrammarService } from "./grammar.service";
import {
	ApiResponseDto,
	SwaggerApiResponse,
	SwaggerApiMessageResponse,
} from "@utils";
import {
	CreateGrammarRequest,
	UpdateGrammarRequest,
	GrammarResponse,
} from "./dto";
import { plainToInstance } from "class-transformer";

@ApiTags("Grammar")
@ApiBearerAuth()
@Controller("grammar")
export class GrammarController {
	constructor(private readonly grammarService: GrammarService) {}

	@Post()
	@SwaggerApiResponse(GrammarResponse)
	async createGrammar(@Body() body: CreateGrammarRequest) {
		const grammar = await this.grammarService.createGrammar(body);
		return new ApiResponseDto(
			plainToInstance(GrammarResponse, grammar),
			null,
			"Grammar created successfully",
		);
	}

	@Get()
	@SwaggerApiResponse(GrammarResponse, { isArray: true, withPagination: true })
	async getGrammars(@Query("page") page = 1, @Query("take") take = 10) {
		const { grammars, pagination } = await this.grammarService.getGrammars(
			page,
			take,
		);
		const results = grammars.map((g) => plainToInstance(GrammarResponse, g));
		return new ApiResponseDto(results, pagination);
	}

	@Get(":id")
	@SwaggerApiResponse(GrammarResponse)
	async getGrammarById(@Param("id") id: string) {
		const grammar = await this.grammarService.getGrammarById(id);
		return new ApiResponseDto(plainToInstance(GrammarResponse, grammar));
	}

	@Patch(":id")
	@SwaggerApiResponse(GrammarResponse)
	async updateGrammar(
		@Param("id") id: string,
		@Body() dto: UpdateGrammarRequest,
	) {
		const grammar = await this.grammarService.updateGrammar(id, dto);
		return new ApiResponseDto(
			plainToInstance(GrammarResponse, grammar),
			null,
			"Grammar updated successfully",
		);
	}

	@Delete(":id")
	@SwaggerApiMessageResponse()
	async deleteGrammar(@Param("id") id: string) {
		await this.grammarService.deleteGrammar(id);
		return new ApiResponseDto(null, null, "Grammar deleted successfully");
	}
}
