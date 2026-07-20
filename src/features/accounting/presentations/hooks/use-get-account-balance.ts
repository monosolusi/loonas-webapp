"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { LedgerAccountRepositoryImpl } from "@/features/accounting/data/repositories/ledger-account";
import { LedgerAccountServiceImpl } from "@/features/accounting/data/sources/ledger-account";
import { GetAccountBalanceUseCase } from "@/features/accounting/domain/usecases/get-account-balance.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetAccountBalanceFetcherParams,
  UseGetAccountBalanceParams,
  UseGetAccountBalanceReturnType,
} from "@/features/accounting/presentations/hooks/use-get-account-balance.types";

const INITIAL_STATE: UseGetAccountBalanceReturnType = { balance: null, loading: true, error: null };

async function GetAccountBalanceFetcher([_, fp]: [string, GetAccountBalanceFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const uc = new GetAccountBalanceUseCase(repo, sessionRepo);
  const result = await uc.execute({ accountId: fp.accountId, startDate: fp.startDate, endDate: fp.endDate });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetAccountBalance(params: UseGetAccountBalanceParams): UseGetAccountBalanceReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    params.accountId
      ? [ACCOUNTING_SWR_KEYS.GET_ACCOUNT_BALANCE, { clerk, accountId: params.accountId, startDate: params.startDate, endDate: params.endDate }]
      : null,
    GetAccountBalanceFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return { balance: null, loading: false, error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN) };
  }
  if (!data) return INITIAL_STATE;

  return { balance: data, loading: false, error: null };
}
