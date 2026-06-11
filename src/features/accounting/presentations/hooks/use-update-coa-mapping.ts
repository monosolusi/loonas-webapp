"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CoaMappingRepositoryImpl } from "@/features/accounting/data/repositories/coa-mapping";
import { CoaMappingServiceImpl } from "@/features/accounting/data/sources/coa-mapping";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { UpdateCoaMappingParams } from "@/features/accounting/domain/repositories/coa-mapping";
import {
  UpdateCoaMappingUseCase,
  UpdateCoaMappingUseCaseParams,
} from "@/features/accounting/domain/usecases/update-coa-mapping.usecases";

type UpdateCoaMappingTriggerParams = UpdateCoaMappingParams;
type UpdateCoaMappingFetcherParams = UpdateCoaMappingTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function UpdateCoaMappingFetcher(
  _: string,
  { arg }: { arg: UpdateCoaMappingFetcherParams },
): Promise<CoaMappingEntity> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new CoaMappingRepositoryImpl(new CoaMappingServiceImpl(new HttpRequest()));
  const useCase = new UpdateCoaMappingUseCase(repo, sessionRepo);
  const result = await useCase.execute(new UpdateCoaMappingUseCaseParams(arg));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useUpdateCoaMapping() {
  return useSWRMutationClerk("update-coa-mapping", UpdateCoaMappingFetcher);
}
