import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";

export type ListProductionRecordsParams = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  productId?: string;
  page?: number;
  limit?: number;
};

export type CreateProductionRecordParams = {
  productId: string;
  variantId: string;
  quantity: number;
  producedAt?: string;
  note?: string;
};

export type DeleteProductionRecordParams = {
  productId: string;
  variantId: string;
  id: string;
};

export interface ProductionRecordRepository {
  list(params: ListProductionRecordsParams, session: SessionEntity): Promise<DataState<PaginatedData<ProductionRecordEntity>>>;
  get(id: string, session: SessionEntity): Promise<DataState<ProductionRecordEntity>>;
  create(params: CreateProductionRecordParams, session: SessionEntity): Promise<DataState<ProductionRecordEntity>>;
  delete(params: DeleteProductionRecordParams, session: SessionEntity): Promise<DataState<void>>;
}
