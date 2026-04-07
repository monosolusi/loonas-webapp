import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductionPreviewEntity } from "@/features/production/domain/entities/production-preview";

export type PreviewProductionParams = {
  productId: string;
  variantId: string;
  quantity: number;
};

export interface ProductionPreviewRepository {
  preview(params: PreviewProductionParams, session: SessionEntity): Promise<DataState<ProductionPreviewEntity>>;
}
