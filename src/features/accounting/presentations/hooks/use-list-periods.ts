"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { AccountingPeriodRepositoryImpl } from "@/features/accounting/data/repositories/accounting-period";
import { AccountingPeriodServiceImpl } from "@/features/accounting/data/sources/accounting-period";
import { ListPeriodsUseCase } from "@/features/accounting/domain/usecases/list-periods.usecases";
import { ListPeriodsParams } from "@/features/accounting/domain/repositories/accounting-period";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListPeriodsFetcherParams,
  UseListPeriodsReturnType,
} from "@/features/accounting/presentations/hooks/use-list-periods.types";

const INITIAL_STATE: UseListPeriodsReturnType = { periods: null, meta: null, loading: true, error: null };

async function ListAccountingPeriodFetcher([_, fp]: [string, ListPeriodsFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new AccountingPeriodRepositoryImpl(new AccountingPeriodServiceImpl(new HttpRequest()));
  const uc = new ListPeriodsUseCase(repo, sessionRepo);
  const result = await uc.execute({ page: fp.params.page, limit: fp.params.limit, status: fp.params.status });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListPeriods(params: ListPeriodsParams = {}): UseListPeriodsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR([ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS, { clerk, params }], ListAccountingPeriodFetcher);

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      periods: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }
  if (!data) return INITIAL_STATE;

  return { periods: data.data, meta: data.meta, loading: false, error: null };
}
