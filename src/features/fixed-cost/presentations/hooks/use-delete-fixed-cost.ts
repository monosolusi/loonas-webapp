"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { FixedCostRepositoryImpl } from "@/features/fixed-cost/data/repositories/fixed-cost";
import { FixedCostServiceImpl } from "@/features/fixed-cost/data/sources/fixed-cost";
import { DeleteFixedCostUseCase, DeleteFixedCostUseCaseParams } from "@/features/fixed-cost/domain/usecases/delete-fixed-cost.usecases";
import { useClerk } from "@clerk/nextjs";

type DeleteFixedCostTriggerParams = { id: string };
type DeleteFixedCostFetcherParams = DeleteFixedCostTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function DeleteFixedCostFetcher(_: string, { arg }: { arg: DeleteFixedCostFetcherParams }): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const fixedCostRepository = new FixedCostRepositoryImpl(new FixedCostServiceImpl(new HttpRequest()));
  const deleteFixedCost = new DeleteFixedCostUseCase(fixedCostRepository, sessionRepository);

  const result = await deleteFixedCost.execute(new DeleteFixedCostUseCaseParams(arg.id));
  if (result instanceof DataFailed) throw result.error;
}

export function useDeleteFixedCost() {
  return useSWRMutationClerk("delete-fixed-cost", DeleteFixedCostFetcher);
}
