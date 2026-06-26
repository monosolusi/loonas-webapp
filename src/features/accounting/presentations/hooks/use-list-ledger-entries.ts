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
import { ListLedgerEntriesUseCase, ListLedgerEntriesUseCaseParams } from "@/features/accounting/domain/usecases/list-ledger-entries.usecases";
import { LedgerEntryEntity } from "@/features/accounting/domain/entities/ledger-entry";
import { ListLedgerEntriesParams } from "@/features/accounting/domain/repositories/ledger-account";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

type FetcherParams = { clerk: ReturnType<typeof useClerk>; accountId: string; params: ListLedgerEntriesParams };

async function Fetcher([_, fp]: [string, FetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const uc = new ListLedgerEntriesUseCase(repo, sessionRepo);
  const result = await uc.execute(new ListLedgerEntriesUseCaseParams(fp.accountId, fp.params));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type ReturnType_ = { entries: LedgerEntryEntity[]; meta: PaginationMeta | null; loading: boolean; error: ServerError | null };

export function useListLedgerEntries(accountId: string | null, params: ListLedgerEntriesParams = {}): ReturnType_ {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    accountId ? [ACCOUNTING_SWR_KEYS.LIST_LEDGER_ENTRIES, { clerk, accountId, params }] : null,
    Fetcher,
  );
  return { entries: data?.entries ?? [], meta: data?.meta ?? null, loading: isLoading, error: error instanceof ServerError ? error : null };
}
