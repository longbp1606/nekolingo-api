import { UserResponse } from "@modules/user/dto";
import { ClsStore } from "nestjs-cls";

export interface NekolingoClsStore extends ClsStore {
	user: UserResponse;
}
