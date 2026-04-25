"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CoaMappingRepositoryImpl } from "@/features/accounting/data/repositories/coa-mapping";
import { CoaMappingServiceImpl } from "@/features/accounting/data/sources/coa-mapping";
import {
  DeleteCoaMappingUseCase,
  DeleteCoaMappingUseCaseParams,
} from "@/features/accounting/domain/usecases/delete-coa-mapping.usecases";

type DeleteCoaMappingTriggerParams = { id: string };
type DeleteCoaMappingFetcherParams = DeleteCoaMappingTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function DeleteCoaMappingFetcher(
  _: string,
  { arg }: { arg: DeleteCoaMappingFetcherParams },
): Promise<void> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new CoaMappingRepositoryImpl(new CoaMappingServiceImpl(new HttpRequest()));
  const useCase = new DeleteCoaMappingUseCase(repo, sessionRepo);
  const result = await useCase.execute(new DeleteCoaMappingUseCaseParams(arg.id));
  if (result instanceof DataFailed) throw result.error;
}

export function useDeleteCoaMapping() {
  return useSWRMutationClerk("delete-coa-mapping", DeleteCoaMappingFetcher);
}
