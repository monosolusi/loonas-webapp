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
  CreateFixedCostEntryUseCase,
  CreateFixedCostEntryUseCaseParams,
} from "@/features/fixed-cost/domain/usecases/create-fixed-cost-entry.usecases";
import { useClerk } from "@clerk/nextjs";

type CreateEntryTriggerParams = { fixedCostId: string; amount: number; startDate: string; endDate: string };
type CreateEntryFetcherParams = CreateEntryTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function CreateEntryFetcher(_: string, { arg }: { arg: CreateEntryFetcherParams }): Promise<FixedCostEntryEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const entryRepository = new FixedCostEntryRepositoryImpl(new FixedCostEntryServiceImpl(new HttpRequest()));
  const createEntry = new CreateFixedCostEntryUseCase(entryRepository, sessionRepository);

  const result = await createEntry.execute(
    new CreateFixedCostEntryUseCaseParams(arg.fixedCostId, arg.amount, arg.startDate, arg.endDate),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreateFixedCostEntry() {
  return useSWRMutationClerk("create-fixed-cost-entry", CreateEntryFetcher);
}
