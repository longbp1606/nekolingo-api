import { Module } from "@nestjs/common";
import { UserArchivementService } from "./user-archivement.service";
import { UserArchivementController } from "./user-archivement.controller";

@Module({
	providers: [UserArchivementService],
	exports: [UserArchivementService],
	controllers: [UserArchivementController],
})
export class UserArchivementModule {}
