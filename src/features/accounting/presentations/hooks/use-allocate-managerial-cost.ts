"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ManagerialCostRepositoryImpl } from "@/features/accounting/data/repositories/managerial-cost";
import { ManagerialCostServiceImpl } from "@/features/accounting/data/sources/managerial-cost";
import { AllocateManagerialCostUseCase, AllocateManagerialCostUseCaseParams, AllocateManagerialCostUseCaseResult } from "@/features/accounting/domain/usecases/allocate-managerial-cost.usecases";

type AllocateManagerialCostTriggerParams = { periodId: string };
type AllocateManagerialCostFetcherParams = AllocateManagerialCostTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function AllocateManagerialCostFetcher(
  _: string,
  { arg }: { arg: AllocateManagerialCostFetcherParams },
): Promise<AllocateManagerialCostUseCaseResult> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new ManagerialCostRepositoryImpl(new ManagerialCostServiceImpl(new HttpRequest()));
  const uc = new AllocateManagerialCostUseCase(repo, sessionRepo);
  const result = await uc.execute(new AllocateManagerialCostUseCaseParams(arg.periodId));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useAllocateManagerialCost() {
  return useSWRMutationClerk<AllocateManagerialCostUseCaseResult, AllocateManagerialCostTriggerParams>(
    "allocate-managerial-cost",
    AllocateManagerialCostFetcher,
  );
}
