"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { ACCOUNTING_MUTATION_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { AccountingPeriodRepositoryImpl } from "@/features/accounting/data/repositories/accounting-period";
import { AccountingPeriodServiceImpl } from "@/features/accounting/data/sources/accounting-period";
import {
  RetryFailedPostingsUseCase,
  RetryFailedPostingsUseCaseParams,
} from "@/features/accounting/domain/usecases/retry-failed-postings.usecases";
import { RetryFailedPostingsResult } from "@/features/accounting/domain/entities/retry-failed-postings-result";

type RetryFailedPostingsTriggerParams = {
  periodId: string;
};
type RetryFailedPostingsFetcherParams = RetryFailedPostingsTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function RetryFailedPostingsFetcher(
  _: string,
  { arg }: { arg: RetryFailedPostingsFetcherParams },
): Promise<RetryFailedPostingsResult> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new AccountingPeriodRepositoryImpl(new AccountingPeriodServiceImpl(new HttpRequest()));
  const uc = new RetryFailedPostingsUseCase(repo, sessionRepo);
  const result = await uc.execute(new RetryFailedPostingsUseCaseParams(arg.periodId));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useRetryFailedPostings() {
  return useSWRMutationClerk<RetryFailedPostingsResult, RetryFailedPostingsTriggerParams>(
    ACCOUNTING_MUTATION_KEYS.RETRY_FAILED_POSTINGS,
    RetryFailedPostingsFetcher,
  );
}
