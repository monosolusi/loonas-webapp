import { useClerk } from "@clerk/nextjs";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";

export type ListPosSaleFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  page: number;
  limit: number;
};

type InitialState = {
  status: "loading";
  sales: null;
  meta: null;
  error: null;
};

type LoadedState = {
  status: "loaded";
  sales: PosSaleEntity[];
  meta: PaginationMeta;
  error: null;
};

type ErrorState = {
  status: "error";
  sales: null;
  meta: null;
  error: ServerError;
};

export type UseListPosSalesState = InitialState | LoadedState | ErrorState;
