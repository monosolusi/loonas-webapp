// Canonical example: types sibling file for list hook.
// Source: src/features/production/presentations/hooks/use-list-production-records.types.ts

import { KeyedMutator } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginatedData, PaginationMeta } from "@/core/resources/paginated";
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
  refresh: KeyedMutator<PaginatedData<ProductionRecordEntity>>;
};

type LoadedState = {
  records: ProductionRecordEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
  refresh: KeyedMutator<PaginatedData<ProductionRecordEntity>>;
};

// `refresh` is non-null on EVERY member: a retry closure is written outside the
// narrowing branch, so TS sees the whole union there. See CLAUDE.md (LNS-757).
type ErrorState = {
  records: null;
  meta: null;
  loading: false;
  error: ServerError;
  refresh: KeyedMutator<PaginatedData<ProductionRecordEntity>>;
};

export type UseListProductionRecordsReturnType = InitialState | LoadedState | ErrorState;
