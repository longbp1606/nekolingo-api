import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class GetLessonExercisesByModeRequest {
	@ApiProperty()
	@IsMongoId()
	user_id: string;

	@ApiProperty()
	@IsMongoId()
	lesson_id: string;
}
