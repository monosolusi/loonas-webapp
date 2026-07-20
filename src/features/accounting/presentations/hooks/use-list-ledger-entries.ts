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
import { ListLedgerEntriesUseCase } from "@/features/accounting/domain/usecases/list-ledger-entries.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListLedgerEntriesFetcherParams,
  UseListLedgerEntriesParams,
  UseListLedgerEntriesReturnType,
} from "@/features/accounting/presentations/hooks/use-list-ledger-entries.types";

const INITIAL_STATE: UseListLedgerEntriesReturnType = { entries: null, meta: null, loading: true, error: null };

async function ListLedgerEntryFetcher([_, fp]: [string, ListLedgerEntriesFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const uc = new ListLedgerEntriesUseCase(repo, sessionRepo);
  const result = await uc.execute({
    accountId: fp.accountId,
    page: fp.page,
    limit: fp.limit,
    startDate: fp.startDate,
    endDate: fp.endDate,
  });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListLedgerEntries(params: UseListLedgerEntriesParams): UseListLedgerEntriesReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    params.accountId
      ? [
          ACCOUNTING_SWR_KEYS.LIST_LEDGER_ENTRIES,
          { clerk, accountId: params.accountId, page: params.page, limit: params.limit, startDate: params.startDate, endDate: params.endDate },
        ]
      : null,
    ListLedgerEntryFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      entries: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }
  if (!data) return INITIAL_STATE;

  return { entries: data.entries, meta: data.meta, loading: false, error: null };
}
