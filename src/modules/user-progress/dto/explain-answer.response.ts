import { ApiProperty } from "@nestjs/swagger";

export class ExplainAnswerResponseDto {
	@ApiProperty({
		example: "Bạn đã dùng 'was', nhưng chủ ngữ là 'they', cần dùng 'were'.",
		description: "Giải thích vì sao đúng/sai.",
	})
	explanation: string;

	@ApiProperty({
		example: "Quá khứ của động từ to be",
		description: "Tên ngữ pháp liên quan (nếu có)",
		required: false,
	})
	grammar?: string;

	@ApiProperty({
		example: "were",
		description: "Đáp án đúng",
	})
	correct_answer: string | string[] | number | object | object[];

	@ApiProperty({
		example: "was",
		description: "Câu trả lời của người học",
		required: false,
	})
	user_answer?: string | string[] | number | object | object[];

	@ApiProperty({
		example: true,
		description: "Người học trả lời sai hay không",
	})
	is_mistake: boolean;
}
