import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";

export type UseListCoaMappingParams = {
  page?: number;
  limit?: number;
  entityType?: string;
};

export type ListCoaMappingFetcherParams = UseListCoaMappingParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  mappings: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  mappings: CoaMappingEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  mappings: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListCoaMappingReturnType = InitialState | LoadedState | ErrorState;
