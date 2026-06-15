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
  CreateJournalUseCase,
  CreateJournalUseCaseParams,
  CreateJournalResult,
  CreateJournalLineInput,
} from "@/features/accounting/domain/usecases/create-journal.usecases";

type CreateJournalTriggerParams = {
  postingDate: string;
  memo: string;
  lines: CreateJournalLineInput[];
  acknowledgedWarningCodes?: string[];
};
type CreateJournalFetcherParams = CreateJournalTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function CreateJournalFetcher(
  _: string,
  { arg }: { arg: CreateJournalFetcherParams },
): Promise<CreateJournalResult> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new JournalRepositoryImpl(new JournalServiceImpl(new HttpRequest()));
  const uc = new CreateJournalUseCase(repo, sessionRepo);
  const result = await uc.execute(
    new CreateJournalUseCaseParams(arg.postingDate, arg.memo, arg.lines, arg.acknowledgedWarningCodes),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreateJournal() {
  return useSWRMutationClerk("create-journal", CreateJournalFetcher);
}
