"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { FixedCostEntryRepositoryImpl } from "@/features/fixed-cost/data/repositories/fixed-cost-entry";
import { FixedCostEntryServiceImpl } from "@/features/fixed-cost/data/sources/fixed-cost-entry";
import { FixedCostEntryEntity } from "@/features/fixed-cost/domain/entities/fixed-cost-entry";
import {
  UpdateFixedCostEntryUseCase,
  UpdateFixedCostEntryUseCaseParams,
} from "@/features/fixed-cost/domain/usecases/update-fixed-cost-entry.usecases";
import { useClerk } from "@clerk/nextjs";

type UpdateEntryTriggerParams = { fixedCostId: string; entryId: string; amount: number };
type UpdateEntryFetcherParams = UpdateEntryTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function UpdateEntryFetcher(_: string, { arg }: { arg: UpdateEntryFetcherParams }): Promise<FixedCostEntryEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const entryRepository = new FixedCostEntryRepositoryImpl(new FixedCostEntryServiceImpl(new HttpRequest()));
  const updateEntry = new UpdateFixedCostEntryUseCase(entryRepository, sessionRepository);

  const result = await updateEntry.execute(
    new UpdateFixedCostEntryUseCaseParams(arg.fixedCostId, arg.entryId, arg.amount),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useUpdateFixedCostEntry() {
  return useSWRMutationClerk("update-fixed-cost-entry", UpdateEntryFetcher);
}
