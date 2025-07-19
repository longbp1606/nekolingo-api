import { UserDocumentType } from "@db/models";
import { ApiProperty } from "@nestjs/swagger";
import { UserRoleEnum } from "src/utils/enum";

export class UserResponse {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	role: UserRoleEnum;

	@ApiProperty()
	avatarUrl: string;

	@ApiProperty()
	currentLevel: number;

	@ApiProperty()
	xp: number;

	@ApiProperty()
	weeklyXp: number;

	@ApiProperty()
	hearts: number;

	@ApiProperty()
	streakDays: number;

	@ApiProperty()
	isFreeze: boolean;

	@ApiProperty()
	lastActiveDate: Date;

	@ApiProperty()
	freezeCount: number;

	@ApiProperty()
	languageFrom: string;

	@ApiProperty()
	languageTo: string;

	@ApiProperty()
	isPremiere: boolean;

	@ApiProperty()
	balance: number;

	@ApiProperty()
	isActive: boolean;

	@ApiProperty()
	currentCourse: string;

	@ApiProperty()
	currentTopic: string;

	@ApiProperty()
	currentLesson: string;

	@ApiProperty()
	createdAt: Date;
	static fromDocument(d: UserDocumentType): UserResponse {
		return {
			id: d._id.toString(),
			email: d.email,
			username: d.username,
			role: d.role,
			avatarUrl: d.avatar_url,
			currentLevel: d.current_level,
			xp: d.xp,
			weeklyXp: d.weekly_xp,
			hearts: d.hearts,
			streakDays: d.streak_days,
			freezeCount: d.freeze_count,
			isFreeze: d.is_freeze,
			lastActiveDate: d.last_active_date,
			languageFrom: d.language_from,
			languageTo: d.language_to,
			isPremiere: d.is_premiere,
			balance: d.balance,
			isActive: d.is_active,
			currentCourse: d.current_course ? d.current_course.toString() : null,
			currentTopic: d.current_topic ? d.current_topic.toString() : null,
			currentLesson: d.current_lesson ? d.current_lesson.toString() : null,
			createdAt: d.createdAt,
		};
	}

	static fromDocuments(docs: UserDocumentType[]): UserResponse[] {
		return docs.map((d) => this.fromDocument(d));
	}
}
