import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";

export type UseListProductionRecordsParams = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  productId?: string;
  page?: number;
  limit?: number;
};

export type ListProductionRecordFetcherParams = UseListProductionRecordsParams & {
  clerk: ReturnType<typeof useClerk>;
};

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
