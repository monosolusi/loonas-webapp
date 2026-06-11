import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductionRecordModel } from "@/features/production/data/models/production-record";
import {
  ListProductionRecordsParams,
  CreateProductionRecordParams,
  DeleteProductionRecordParams,
} from "@/features/production/domain/repositories/production-record";

export type ListProductionRecordsServiceResult = {
  data: ProductionRecordModel[];
  meta: PaginationMeta;
};

export interface ProductionRecordService {
  list(params: ListProductionRecordsParams, session: SessionEntity): Promise<ListProductionRecordsServiceResult>;
  get(id: string, session: SessionEntity): Promise<ProductionRecordModel>;
  create(params: CreateProductionRecordParams, session: SessionEntity): Promise<ProductionRecordModel>;
  delete(params: DeleteProductionRecordParams, session: SessionEntity): Promise<void>;
}
