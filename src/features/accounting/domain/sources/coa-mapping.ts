import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingModel } from "@/features/accounting/data/models/coa-mapping";
import {
  ListCoaMappingsParams,
  CreateCoaMappingParams,
  UpdateCoaMappingParams,
  DeleteCoaMappingParams,
} from "@/features/accounting/domain/repositories/coa-mapping";

export type ListCoaMappingsServiceResult = {
  data: CoaMappingModel[];
  meta: PaginationMeta;
};

export interface CoaMappingService {
  list(params: ListCoaMappingsParams, session: SessionEntity): Promise<ListCoaMappingsServiceResult>;
  create(params: CreateCoaMappingParams, session: SessionEntity): Promise<CoaMappingModel>;
  update(params: UpdateCoaMappingParams, session: SessionEntity): Promise<CoaMappingModel>;
  delete(params: DeleteCoaMappingParams, session: SessionEntity): Promise<void>;
}
