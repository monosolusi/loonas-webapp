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
import { CreateCoaMappingUseCase, CreateCoaMappingUseCaseParams } from "@/features/accounting/domain/usecases/create-coa-mapping.usecases";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";

type CreateCoaMappingTriggerParams = {
  entityType: string;
  debitAccountId: string;
  creditAccountId: string;
  entityId?: string;
};

type CreateCoaMappingFetcherParams = CreateCoaMappingTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function CreateCoaMappingFetcher(
  _: string,
  { arg }: { arg: CreateCoaMappingFetcherParams },
): Promise<CoaMappingEntity> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new CoaMappingRepositoryImpl(new CoaMappingServiceImpl(new HttpRequest()));
  const uc = new CreateCoaMappingUseCase(repo, sessionRepo);
  const result = await uc.execute(
    new CreateCoaMappingUseCaseParams(arg.entityType, arg.debitAccountId, arg.creditAccountId, arg.entityId),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreateCoaMapping() {
  return useSWRMutationClerk("create-coa-mapping", CreateCoaMappingFetcher);
}
