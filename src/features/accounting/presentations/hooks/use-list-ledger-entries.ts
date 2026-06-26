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
import { ListLedgerEntriesUseCase } from "@/features/accounting/domain/usecases/list-ledger-entries.usecases";
import { LedgerEntryEntity } from "@/features/accounting/domain/entities/ledger-entry";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  accountId: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

async function Fetcher([_, fp]: [string, FetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const uc = new ListLedgerEntriesUseCase(repo, sessionRepo);
  const result = await uc.execute({ accountId: fp.accountId, page: fp.page, limit: fp.limit, startDate: fp.startDate, endDate: fp.endDate });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type ReturnType_ = { entries: LedgerEntryEntity[]; meta: PaginationMeta | null; loading: boolean; error: ServerError | null };

export function useListLedgerEntries(params: {
  accountId: string | null;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}): ReturnType_ {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    params.accountId
      ? [
          ACCOUNTING_SWR_KEYS.LIST_LEDGER_ENTRIES,
          { clerk, accountId: params.accountId, page: params.page, limit: params.limit, startDate: params.startDate, endDate: params.endDate },
        ]
      : null,
    Fetcher,
  );
  return { entries: data?.entries ?? [], meta: data?.meta ?? null, loading: isLoading, error: error instanceof ServerError ? error : null };
}
