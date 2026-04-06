import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";

export type UseListPurchasesParams = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export type ListPurchaseFetcherParams = UseListPurchasesParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  purchases: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  purchases: PurchaseEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  purchases: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListPurchasesReturnType = InitialState | LoadedState | ErrorState;
