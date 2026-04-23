// Canonical example: types sibling file for list hook.
// Source: src/features/production/presentations/hooks/use-list-production-records.types.ts

import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";

// Public input the hook accepts. Do NOT include `clerk` here.
export type UseListProductionRecordsParams = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  productId?: string;
  page?: number;
  limit?: number;
};

// Fetcher receives public params + clerk (from useClerk inside the hook).
export type ListProductionRecordFetcherParams = UseListProductionRecordsParams & {
  clerk: ReturnType<typeof useClerk>;
};

// Discriminated union guarantees callers pattern-match state exclusively.
type InitialState = {
  records: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  records: ProductionRecordEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  records: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListProductionRecordsReturnType = InitialState | LoadedState | ErrorState;
