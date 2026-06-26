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
import { GetAccountBalanceUseCase, GetAccountBalanceUseCaseParams } from "@/features/accounting/domain/usecases/get-account-balance.usecases";
import { AccountBalanceEntity } from "@/features/accounting/domain/entities/account-balance";
import { GetAccountBalanceParams } from "@/features/accounting/domain/repositories/ledger-account";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

type FetcherParams = { clerk: ReturnType<typeof useClerk>; accountId: string; params: GetAccountBalanceParams };

async function Fetcher([_, fp]: [string, FetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const uc = new GetAccountBalanceUseCase(repo, sessionRepo);
  const result = await uc.execute(new GetAccountBalanceUseCaseParams(fp.accountId, fp.params));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type ReturnType_ = { balance: AccountBalanceEntity | null; loading: boolean; error: ServerError | null };

export function useGetAccountBalance(accountId: string | null, params: GetAccountBalanceParams = {}): ReturnType_ {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    accountId ? [ACCOUNTING_SWR_KEYS.GET_ACCOUNT_BALANCE, { clerk, accountId, params }] : null,
    Fetcher,
  );
  return { balance: data ?? null, loading: isLoading, error: error instanceof ServerError ? error : null };
}
