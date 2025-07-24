import { Module } from "@nestjs/common";
import { ArchivementService } from "./archivement.service";
import { ArchivementController } from "./archivement.controller";
import { ArchivementCheckerService } from "./archivement-checker.service";

@Module({
	providers: [ArchivementService, ArchivementCheckerService],
	exports: [ArchivementService, ArchivementCheckerService],
	controllers: [ArchivementController],
})
export class ArchivementModule {}
