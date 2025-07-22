import { ApiProperty } from "@nestjs/swagger";

export class ExplainAnswerResponseDto {
	@ApiProperty({
		example: "Bạn đã dùng 'was', nhưng chủ ngữ là 'they', cần dùng 'were'.",
	})
	explanation: string;

	@ApiProperty({ example: "Quá khứ của động từ to be", required: false })
	grammar?: string;

	@ApiProperty({ example: "were" })
	correct_answer: any;

	@ApiProperty({ example: "was" })
	user_answer?: string;

	@ApiProperty({ example: true })
	is_mistake: boolean;
}
