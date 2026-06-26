import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingModel } from "@/features/accounting/data/models/coa-mapping";
import { CoaMappingLinePosition } from "@/features/accounting/domain/entities/coa-mapping-line";

export type ListCoaMappingsServiceParams = {
  page?: number;
  limit?: number;
  entityType?: string;
};

export type CoaMappingLineServiceInput = {
  accountId: string;
  position: CoaMappingLinePosition;
  label?: string;
  sortOrder?: number;
};

export type CreateCoaMappingServiceParams = {
  entityType: string;
  entityId?: string | null;
  lines: CoaMappingLineServiceInput[];
};

export type UpdateCoaMappingServiceParams = {
  id: string;
  lines: CoaMappingLineServiceInput[];
};

export type DeleteCoaMappingServiceParams = {
  id: string;
};

export type ListCoaMappingsServiceResult = {
  data: CoaMappingModel[];
  meta: PaginationMeta;
};

export interface CoaMappingService {
  list(params: ListCoaMappingsServiceParams, session: SessionEntity): Promise<ListCoaMappingsServiceResult>;
  create(params: CreateCoaMappingServiceParams, session: SessionEntity): Promise<CoaMappingModel>;
  update(params: UpdateCoaMappingServiceParams, session: SessionEntity): Promise<CoaMappingModel>;
  delete(params: DeleteCoaMappingServiceParams, session: SessionEntity): Promise<void>;
}
