import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";

export type ListCoaMappingsParams = {
  page?: number;
  limit?: number;
  entityType?: string;
};

export interface CoaMappingRepository {
  list(params: ListCoaMappingsParams, session: SessionEntity): Promise<DataState<PaginatedData<CoaMappingEntity>>>;
}
