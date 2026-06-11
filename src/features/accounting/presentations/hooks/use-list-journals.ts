"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { JournalRepositoryImpl } from "@/features/accounting/data/repositories/journal";
import { JournalServiceImpl } from "@/features/accounting/data/sources/journal";
import { ListJournalsUseCase, ListJournalsUseCaseParams } from "@/features/accounting/domain/usecases/list-journals.usecases";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { ListJournalsParams } from "@/features/accounting/domain/repositories/journal";

type FetcherParams = { clerk: ReturnType<typeof useClerk>; params: ListJournalsParams };

async function Fetcher([_, fp]: [string, FetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new JournalRepositoryImpl(new JournalServiceImpl(new HttpRequest()));
  const uc = new ListJournalsUseCase(repo, sessionRepo);
  const result = await uc.execute(new ListJournalsUseCaseParams(fp.params));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type ReturnType_ = {
  journals: JournalEntity[];
  meta: PaginationMeta | null;
  totalDebit: number;
  totalCredit: number;
  loading: boolean;
  error: ServerError | null;
};

export function useListJournals(params: ListJournalsParams = {}): ReturnType_ {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-journals", { clerk, params }], Fetcher);

  const journals = data?.journals ?? [];
  const totalDebit = journals.reduce((sum, j) => sum + j.totalDebit, 0);
  const totalCredit = journals.reduce((sum, j) => sum + j.totalCredit, 0);

  return {
    journals,
    meta: data?.meta ?? null,
    totalDebit,
    totalCredit,
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
