import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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

@ApiTags("Grammar")
@Controller("grammar")
export class GrammarController {
	constructor(private readonly grammarService: GrammarService) {}

	@Post()
	@SwaggerApiResponse(GrammarResponse)
	async createGrammar(@Body() dto: CreateGrammarRequest) {
		const grammar = await this.grammarService.createGrammar(dto);
		return new ApiResponseDto(grammar, null, "Grammar created successfully");
	}

	@Get()
	@SwaggerApiResponse(GrammarResponse, { isArray: true, withPagination: true })
	async getGrammars(
		@Query("page") page: number = 1,
		@Query("take") take: number = 10,
	) {
		const { grammars, pagination } = await this.grammarService.getGrammars(
			page,
			take,
		);
		return new ApiResponseDto(grammars, pagination);
	}

	@Get(":id")
	@SwaggerApiResponse(GrammarResponse)
	async getGrammarById(@Param("id") id: string) {
		const grammar = await this.grammarService.getGrammarById(id);
		return new ApiResponseDto(grammar);
	}

	@Put(":id")
	@SwaggerApiResponse(GrammarResponse)
	async updateGrammar(
		@Param("id") id: string,
		@Body() dto: UpdateGrammarRequest,
	) {
		const grammar = await this.grammarService.updateGrammar(id, dto);
		return new ApiResponseDto(grammar, null, "Grammar updated successfully");
	}

	@Delete(":id")
	@SwaggerApiMessageResponse()
	async deleteGrammar(@Param("id") id: string) {
		await this.grammarService.deleteGrammar(id);
		return new ApiResponseDto(null, null, "Grammar deleted successfully");
	}
}
