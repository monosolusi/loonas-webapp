"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { AccountingPeriodRepositoryImpl } from "@/features/accounting/data/repositories/accounting-period";
import { AccountingPeriodServiceImpl } from "@/features/accounting/data/sources/accounting-period";
import { ListPeriodsUseCase, ListPeriodsUseCaseParams } from "@/features/accounting/domain/usecases/list-periods.usecases";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { ListPeriodsParams } from "@/features/accounting/domain/repositories/accounting-period";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

type FetcherParams = { clerk: ReturnType<typeof useClerk>; params: ListPeriodsParams };

async function ListAccountingPeriodFetcher([_, fp]: [string, FetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new AccountingPeriodRepositoryImpl(new AccountingPeriodServiceImpl(new HttpRequest()));
  const uc = new ListPeriodsUseCase(repo, sessionRepo);
  const result = await uc.execute(new ListPeriodsUseCaseParams(fp.params));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type ReturnType_ = {
  periods: AccountingPeriodEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: ServerError | null;
};

export function useListPeriods(params: ListPeriodsParams = {}): ReturnType_ {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR([ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS, { clerk, params }], ListAccountingPeriodFetcher);

  return {
    periods: data?.data ?? [],
    meta: data?.meta ?? null,
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
