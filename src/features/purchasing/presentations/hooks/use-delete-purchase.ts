"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PurchaseRepositoryImpl } from "@/features/purchasing/data/repositories/purchase";
import { PurchaseServiceImpl } from "@/features/purchasing/data/sources/purchase";
import { DeletePurchaseUseCase, DeletePurchaseUseCaseParams } from "@/features/purchasing/domain/usecases/delete-purchase.usecases";

type DeletePurchaseTriggerParams = { id: string };
type DeletePurchaseFetcherParams = DeletePurchaseTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function DeletePurchaseFetcher(_: string, { arg }: { arg: DeletePurchaseFetcherParams }): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const purchaseRepository = new PurchaseRepositoryImpl(new PurchaseServiceImpl(new HttpRequest()));
  const useCase = new DeletePurchaseUseCase(purchaseRepository, sessionRepository);
  const result = await useCase.execute(new DeletePurchaseUseCaseParams(arg.id));
  if (result instanceof DataFailed) throw result.error;
}

export function useDeletePurchase() {
  return useSWRMutationClerk("delete-purchase", DeletePurchaseFetcher);
}
