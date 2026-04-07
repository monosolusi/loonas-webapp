import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductionPreviewModel } from "@/features/production/data/models/production-preview";
import { PreviewProductionParams } from "@/features/production/domain/repositories/production-preview";

export interface ProductionPreviewService {
  preview(params: PreviewProductionParams, session: SessionEntity): Promise<ProductionPreviewModel>;
}
