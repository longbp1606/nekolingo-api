import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class CompleteLessonRequest {
	@ApiProperty()
	@IsMongoId()
	user_id: string;

	@ApiProperty()
	@IsMongoId()
	lesson_id: string;
}
