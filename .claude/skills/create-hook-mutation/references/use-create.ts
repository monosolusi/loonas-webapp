// Canonical example: create mutation hook returning the new entity.
// Source: src/features/production/presentations/hooks/use-create-production-record.ts

"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductionRecordRepositoryImpl } from "@/features/production/data/repositories/production-record";
import { ProductionRecordServiceImpl } from "@/features/production/data/sources/production-record";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import { CreateProductionRecordParams } from "@/features/production/domain/repositories/production-record";
import {
  CreateProductionRecordUseCase,
  CreateProductionRecordUseCaseParams,
} from "@/features/production/domain/usecases/create-production-record.usecases";

// Trigger params = repo params. One of the few places presentation imports repo params.
type CreateProductionRecordTriggerParams = CreateProductionRecordParams;
type CreateProductionRecordFetcherParams = CreateProductionRecordTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function CreateProductionRecordFetcher(
  _: string,
  { arg }: { arg: CreateProductionRecordFetcherParams },
): Promise<ProductionRecordEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const productionRecordRepository = new ProductionRecordRepositoryImpl(
    new ProductionRecordServiceImpl(new HttpRequest()),
  );
  const useCase = new CreateProductionRecordUseCase(productionRecordRepository, sessionRepository);
  const result = await useCase.execute(new CreateProductionRecordUseCaseParams(arg));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreateProductionRecord() {
  return useSWRMutationClerk("create-production-record", CreateProductionRecordFetcher);
}
