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
import { GetJournalUseCase, GetJournalUseCaseParams } from "@/features/accounting/domain/usecases/get-journal.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { GetJournalFetcherParams, UseGetJournalReturnType } from "@/features/accounting/presentations/hooks/use-get-journal.types";

const INITIAL_STATE: UseGetJournalReturnType = {
  data: null,
  loading: true,
  error: null,
  refresh: null,
};

async function GetJournalFetcher([_, params]: [string, GetJournalFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new JournalRepositoryImpl(new JournalServiceImpl(new HttpRequest()));
  const uc = new GetJournalUseCase(repo, sessionRepo);
  const result = await uc.execute(new GetJournalUseCaseParams(params.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetJournal(id: string): UseGetJournalReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.GET_JOURNAL, { id, clerk }],
    GetJournalFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: null,
    };
  }
  if (!data) return INITIAL_STATE;

  return {
    data,
    loading: false,
    error: null,
    refresh: mutate,
  };
}
