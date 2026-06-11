"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { FixedCostRepositoryImpl } from "@/features/fixed-cost/data/repositories/fixed-cost";
import { FixedCostServiceImpl } from "@/features/fixed-cost/data/sources/fixed-cost";
import { CreateFixedCostUseCase, CreateFixedCostUseCaseParams } from "@/features/fixed-cost/domain/usecases/create-fixed-cost.usecases";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";
import { useClerk } from "@clerk/nextjs";

type CreateFixedCostTriggerParams = { name: string };
type CreateFixedCostFetcherParams = CreateFixedCostTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function CreateFixedCostFetcher(_: string, { arg }: { arg: CreateFixedCostFetcherParams }): Promise<FixedCostEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const fixedCostRepository = new FixedCostRepositoryImpl(new FixedCostServiceImpl(new HttpRequest()));
  const createFixedCost = new CreateFixedCostUseCase(fixedCostRepository, sessionRepository);

  const result = await createFixedCost.execute(new CreateFixedCostUseCaseParams(arg.name));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreateFixedCost() {
  return useSWRMutationClerk("create-fixed-cost", CreateFixedCostFetcher);
}
