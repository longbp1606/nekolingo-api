import { Module } from "@nestjs/common";
import { ArchivementService } from "./archivement.service";
import { ArchivementController } from "./archivement.controller";

@Module({
	providers: [ArchivementService],
	exports: [ArchivementService],
	controllers: [ArchivementController],
})
export class ArchivementModule {}
