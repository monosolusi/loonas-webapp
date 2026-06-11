"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { FixedCostEntryRepositoryImpl } from "@/features/fixed-cost/data/repositories/fixed-cost-entry";
import { FixedCostEntryServiceImpl } from "@/features/fixed-cost/data/sources/fixed-cost-entry";
import {
  DeleteFixedCostEntryUseCase,
  DeleteFixedCostEntryUseCaseParams,
} from "@/features/fixed-cost/domain/usecases/delete-fixed-cost-entry.usecases";
import { useClerk } from "@clerk/nextjs";

type DeleteEntryTriggerParams = { fixedCostId: string; entryId: string };
type DeleteEntryFetcherParams = DeleteEntryTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function DeleteEntryFetcher(_: string, { arg }: { arg: DeleteEntryFetcherParams }): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const entryRepository = new FixedCostEntryRepositoryImpl(new FixedCostEntryServiceImpl(new HttpRequest()));
  const deleteEntry = new DeleteFixedCostEntryUseCase(entryRepository, sessionRepository);

  const result = await deleteEntry.execute(new DeleteFixedCostEntryUseCaseParams(arg.fixedCostId, arg.entryId));
  if (result instanceof DataFailed) throw result.error;
}

export function useDeleteFixedCostEntry() {
  return useSWRMutationClerk("delete-fixed-cost-entry", DeleteEntryFetcher);
}
