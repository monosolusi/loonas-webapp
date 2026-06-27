"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { JournalRepositoryImpl } from "@/features/accounting/data/repositories/journal";
import { JournalServiceImpl } from "@/features/accounting/data/sources/journal";
import { ListJournalsUseCase } from "@/features/accounting/domain/usecases/list-journals.usecases";
import { ListJournalsParams } from "@/features/accounting/domain/repositories/journal";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListJournalsFetcherParams,
  UseListJournalsReturnType,
} from "@/features/accounting/presentations/hooks/use-list-journals.types";

const INITIAL_STATE: UseListJournalsReturnType = {
  journals: null,
  meta: null,
  totalDebit: 0,
  totalCredit: 0,
  loading: true,
  error: null,
};

async function ListJournalFetcher([_, fp]: [string, ListJournalsFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new JournalRepositoryImpl(new JournalServiceImpl(new HttpRequest()));
  const uc = new ListJournalsUseCase(repo, sessionRepo);
  const result = await uc.execute({
    page: fp.params.page,
    limit: fp.params.limit,
    search: fp.params.search,
    dateFrom: fp.params.dateFrom,
    dateTo: fp.params.dateTo,
  });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListJournals(params: ListJournalsParams = {}): UseListJournalsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR([ACCOUNTING_SWR_KEYS.LIST_JOURNALS, { clerk, params }], ListJournalFetcher);

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      journals: null,
      meta: null,
      totalDebit: 0,
      totalCredit: 0,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }
  if (!data) return INITIAL_STATE;

  const totalDebit = data.journals.reduce((sum, j) => sum + j.totalDebit, 0);
  const totalCredit = data.journals.reduce((sum, j) => sum + j.totalCredit, 0);

  return { journals: data.journals, meta: data.meta, totalDebit, totalCredit, loading: false, error: null };
}
