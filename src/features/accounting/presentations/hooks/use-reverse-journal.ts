"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { JournalRepositoryImpl } from "@/features/accounting/data/repositories/journal";
import { JournalServiceImpl } from "@/features/accounting/data/sources/journal";
import {
  ReverseJournalUseCase,
  ReverseJournalUseCaseParams,
  ReverseJournalResult,
} from "@/features/accounting/domain/usecases/reverse-journal.usecases";

type ReverseJournalTriggerParams = {
  id: string;
  changeReasonCategory: string;
  changeReasonDetail: string;
  postingDate?: string;
  acknowledgedWarningCodes?: string[];
};
type ReverseJournalFetcherParams = ReverseJournalTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function ReverseJournalFetcher(
  _: string,
  { arg }: { arg: ReverseJournalFetcherParams },
): Promise<ReverseJournalResult> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new JournalRepositoryImpl(new JournalServiceImpl(new HttpRequest()));
  const uc = new ReverseJournalUseCase(repo, sessionRepo);
  const result = await uc.execute(
    new ReverseJournalUseCaseParams(
      arg.id,
      arg.changeReasonCategory,
      arg.changeReasonDetail,
      arg.postingDate,
      arg.acknowledgedWarningCodes,
    ),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useReverseJournal() {
  return useSWRMutationClerk("reverse-journal", ReverseJournalFetcher);
}
