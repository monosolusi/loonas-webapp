// Canonical example: delete mutation hook. Returns Promise<void>.
// Source: src/features/production/presentations/hooks/use-delete-production-record.ts

"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductionRecordRepositoryImpl } from "@/features/production/data/repositories/production-record";
import { ProductionRecordServiceImpl } from "@/features/production/data/sources/production-record";
import { DeleteProductionRecordParams } from "@/features/production/domain/repositories/production-record";
import {
  DeleteProductionRecordUseCase,
  DeleteProductionRecordUseCaseParams,
} from "@/features/production/domain/usecases/delete-production-record.usecases";

type DeleteProductionRecordTriggerParams = DeleteProductionRecordParams;
type DeleteProductionRecordFetcherParams = DeleteProductionRecordTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function DeleteProductionRecordFetcher(
  _: string,
  { arg }: { arg: DeleteProductionRecordFetcherParams },
): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const productionRecordRepository = new ProductionRecordRepositoryImpl(
    new ProductionRecordServiceImpl(new HttpRequest()),
  );
  const useCase = new DeleteProductionRecordUseCase(productionRecordRepository, sessionRepository);
  const result = await useCase.execute(new DeleteProductionRecordUseCaseParams(arg));
  if (result instanceof DataFailed) throw result.error;
  // No data to return — delete resolves to void.
}

export function useDeleteProductionRecord() {
  return useSWRMutationClerk("delete-production-record", DeleteProductionRecordFetcher);
}
