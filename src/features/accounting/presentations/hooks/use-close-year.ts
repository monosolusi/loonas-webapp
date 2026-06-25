"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { AccountingPeriodRepositoryImpl } from "@/features/accounting/data/repositories/accounting-period";
import { AccountingPeriodServiceImpl } from "@/features/accounting/data/sources/accounting-period";
import {
  CloseYearUseCase,
  CloseYearUseCaseParams,
  CloseYearUseCaseResult,
} from "@/features/accounting/domain/usecases/close-year.usecases";

type CloseYearTriggerParams = {
  year: number;
  idempotencyKey: string;
  retainedEarningsAccountId?: string;
};
type CloseYearFetcherParams = CloseYearTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function CloseYearFetcher(
  _: string,
  { arg }: { arg: CloseYearFetcherParams },
): Promise<CloseYearUseCaseResult> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new AccountingPeriodRepositoryImpl(new AccountingPeriodServiceImpl(new HttpRequest()));
  const uc = new CloseYearUseCase(repo, sessionRepo);
  const result = await uc.execute(new CloseYearUseCaseParams(arg.year, arg.idempotencyKey, arg.retainedEarningsAccountId));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCloseYear() {
  return useSWRMutationClerk<CloseYearUseCaseResult, CloseYearTriggerParams>("close-year", CloseYearFetcher);
}
