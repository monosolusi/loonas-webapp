"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PurchaseRepositoryImpl } from "@/features/purchasing/data/repositories/purchase";
import { PurchaseServiceImpl } from "@/features/purchasing/data/sources/purchase";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";
import { CreatePurchaseUseCase, CreatePurchaseUseCaseParams } from "@/features/purchasing/domain/usecases/create-purchase.usecases";
import { CreatePurchaseParams } from "@/features/purchasing/domain/repositories/purchase";

type CreatePurchaseTriggerParams = CreatePurchaseParams;
type CreatePurchaseFetcherParams = CreatePurchaseTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function CreatePurchaseFetcher(
  _: string,
  { arg }: { arg: CreatePurchaseFetcherParams },
): Promise<PurchaseEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const purchaseRepository = new PurchaseRepositoryImpl(new PurchaseServiceImpl(new HttpRequest()));
  const useCase = new CreatePurchaseUseCase(purchaseRepository, sessionRepository);
  const result = await useCase.execute(new CreatePurchaseUseCaseParams(arg));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreatePurchase() {
  return useSWRMutationClerk("create-purchase", CreatePurchaseFetcher);
}
