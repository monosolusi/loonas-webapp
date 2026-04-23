// Canonical example: service interface. Returns Models. Defines list-result shape.
// Source: src/features/production/domain/sources/production-record.ts

import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductionRecordModel } from "@/features/production/data/models/production-record";
import {
  ListProductionRecordsParams,
  CreateProductionRecordParams,
  DeleteProductionRecordParams,
} from "@/features/production/domain/repositories/production-record";

// Paginated list → service returns a ListXxxServiceResult with Models.
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
