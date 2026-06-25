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
import { ClosePeriodUseCase, ClosePeriodUseCaseParams } from "@/features/accounting/domain/usecases/close-period.usecases";
import { ClosePeriodResult } from "@/features/accounting/domain/entities/close-warning";

type ClosePeriodTriggerParams = {
  id: string;
  idempotencyKey: string;
  reason?: string;
};
type ClosePeriodFetcherParams = ClosePeriodTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function ClosePeriodFetcher(
  _: string,
  { arg }: { arg: ClosePeriodFetcherParams },
): Promise<ClosePeriodResult> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new AccountingPeriodRepositoryImpl(new AccountingPeriodServiceImpl(new HttpRequest()));
  const uc = new ClosePeriodUseCase(repo, sessionRepo);
  const result = await uc.execute(new ClosePeriodUseCaseParams(arg.id, arg.idempotencyKey, arg.reason));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useClosePeriod() {
  return useSWRMutationClerk<ClosePeriodResult, ClosePeriodTriggerParams>("close-period", ClosePeriodFetcher);
}
