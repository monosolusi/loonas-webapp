import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { ListPeriodsParams } from "@/features/accounting/domain/repositories/accounting-period";

export type ListPeriodsFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  params: ListPeriodsParams;
};

type InitialState = {
  periods: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  periods: AccountingPeriodEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  periods: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListPeriodsReturnType = InitialState | LoadedState | ErrorState;
