"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { LedgerAccountRepositoryImpl } from "@/features/accounting/data/repositories/ledger-account";
import { LedgerAccountServiceImpl } from "@/features/accounting/data/sources/ledger-account";
import { ListLedgerAccountsUseCase, ListLedgerAccountsUseCaseParams } from "@/features/accounting/domain/usecases/list-ledger-accounts.usecases";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { ListLedgerAccountsParams } from "@/features/accounting/domain/repositories/ledger-account";

type FetcherParams = { clerk: ReturnType<typeof useClerk>; params: ListLedgerAccountsParams };

async function Fetcher([_, fp]: [string, FetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const uc = new ListLedgerAccountsUseCase(repo, sessionRepo);
  const result = await uc.execute(new ListLedgerAccountsUseCaseParams(fp.params));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type ReturnType_ = { accounts: LedgerAccountEntity[]; meta: PaginationMeta | null; loading: boolean; error: ServerError | null };

export function useListLedgerAccounts(params: ListLedgerAccountsParams = {}): ReturnType_ {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-ledger-accounts", { clerk, params }], Fetcher);
  return { accounts: data?.accounts ?? [], meta: data?.meta ?? null, loading: isLoading, error: error instanceof ServerError ? error : null };
}
