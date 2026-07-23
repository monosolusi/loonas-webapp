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
  ReopenYearUseCase,
  ReopenYearUseCaseParams,
  ReopenYearUseCaseResult,
} from "@/features/accounting/domain/usecases/reopen-year.usecases";

type ReopenYearTriggerParams = {
  year: number;
  confirmationToken: string;
  reason: string;
  idempotencyKey: string;
};
type ReopenYearFetcherParams = ReopenYearTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function ReopenYearFetcher(
  _: string,
  { arg }: { arg: ReopenYearFetcherParams },
): Promise<ReopenYearUseCaseResult> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new AccountingPeriodRepositoryImpl(new AccountingPeriodServiceImpl(new HttpRequest()));
  const uc = new ReopenYearUseCase(repo, sessionRepo);
  const result = await uc.execute(new ReopenYearUseCaseParams(arg.year, arg.confirmationToken, arg.reason, arg.idempotencyKey));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useReopenYear() {
  return useSWRMutationClerk<ReopenYearUseCaseResult, ReopenYearTriggerParams>(ACCOUNTING_MUTATION_KEYS.REOPEN_YEAR, ReopenYearFetcher);
}
