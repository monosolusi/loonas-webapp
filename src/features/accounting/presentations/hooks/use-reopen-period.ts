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
import { ReopenPeriodUseCase, ReopenPeriodUseCaseParams } from "@/features/accounting/domain/usecases/reopen-period.usecases";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";

type ReopenPeriodTriggerParams = {
  id: string;
  reason: string;
  idempotencyKey: string;
};
type ReopenPeriodFetcherParams = ReopenPeriodTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function ReopenPeriodFetcher(
  _: string,
  { arg }: { arg: ReopenPeriodFetcherParams },
): Promise<AccountingPeriodEntity> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new AccountingPeriodRepositoryImpl(new AccountingPeriodServiceImpl(new HttpRequest()));
  const uc = new ReopenPeriodUseCase(repo, sessionRepo);
  const result = await uc.execute(new ReopenPeriodUseCaseParams(arg.id, arg.reason, arg.idempotencyKey));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useReopenPeriod() {
  return useSWRMutationClerk<AccountingPeriodEntity, ReopenPeriodTriggerParams>("reopen-period", ReopenPeriodFetcher);
}
