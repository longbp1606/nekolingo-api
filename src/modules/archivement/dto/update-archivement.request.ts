import { PartialType } from "@nestjs/swagger";
import { CreateArchivementRequest } from "./create-archivement.request";

export class UpdateArchivementRequest extends PartialType(
	CreateArchivementRequest,
) {}
