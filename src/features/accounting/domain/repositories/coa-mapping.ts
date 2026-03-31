import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";

export type ListCoaMappingsParams = {
  page?: number;
  limit?: number;
  entityType?: string;
};

export type CreateCoaMappingParams = {
  entityType: string;
  entityId?: string;
  debitAccountId: string;
  creditAccountId: string;
};

export type UpdateCoaMappingParams = {
  id: string;
  debitAccountId?: string;
  creditAccountId?: string;
};

export interface CoaMappingRepository {
  list(params: ListCoaMappingsParams, session: SessionEntity): Promise<DataState<PaginatedData<CoaMappingEntity>>>;
  create(params: CreateCoaMappingParams, session: SessionEntity): Promise<DataState<CoaMappingEntity>>;
  update(params: UpdateCoaMappingParams, session: SessionEntity): Promise<DataState<CoaMappingEntity>>;
  delete(id: string, session: SessionEntity): Promise<DataState<void>>;
}
