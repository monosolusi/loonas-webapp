import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingLinePosition } from "@/features/accounting/domain/entities/coa-mapping-line";

export type ListCoaMappingsParams = {
  page?: number;
  limit?: number;
  entityType?: string;
};

export type CoaMappingLineInput = {
  accountId: string;
  position: CoaMappingLinePosition;
  label?: string;
  sortOrder?: number;
};

export type CreateCoaMappingParams = {
  entityType: string;
  entityId?: string | null;
  lines: CoaMappingLineInput[];
};

export type UpdateCoaMappingParams = {
  id: string;
  lines: CoaMappingLineInput[];
};

export type DeleteCoaMappingParams = {
  id: string;
};

export interface CoaMappingRepository {
  list(params: ListCoaMappingsParams, session: SessionEntity): Promise<DataState<PaginatedData<CoaMappingEntity>>>;
  create(params: CreateCoaMappingParams, session: SessionEntity): Promise<DataState<CoaMappingEntity>>;
  update(params: UpdateCoaMappingParams, session: SessionEntity): Promise<DataState<CoaMappingEntity>>;
  delete(params: DeleteCoaMappingParams, session: SessionEntity): Promise<DataState<void>>;
}
