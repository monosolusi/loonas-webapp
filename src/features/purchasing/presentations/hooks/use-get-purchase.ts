"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PurchaseRepositoryImpl } from "@/features/purchasing/data/repositories/purchase";
import { PurchaseServiceImpl } from "@/features/purchasing/data/sources/purchase";
import { GetPurchaseUseCase, GetPurchaseUseCaseParams } from "@/features/purchasing/domain/usecases/get-purchase.usecases";
import { PURCHASE_SWR_KEYS } from "@/features/purchasing/presentations/constants/swr-keys";
import { UseGetPurchaseReturnType } from "@/features/purchasing/presentations/hooks/use-get-purchase.types";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  id: string;
};

const INITIAL_STATE: UseGetPurchaseReturnType = {
  purchase: null,
  loading: true,
  error: null,
};

async function GetPurchaseFetcher([_, params]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const purchaseRepository = new PurchaseRepositoryImpl(new PurchaseServiceImpl(new HttpRequest()));
  const useCase = new GetPurchaseUseCase(purchaseRepository, sessionRepository);
  const result = await useCase.execute(new GetPurchaseUseCaseParams(params.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetPurchase(id: string | null): UseGetPurchaseReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    id ? [PURCHASE_SWR_KEYS.GET_PURCHASE, { clerk, id }] : null,
    GetPurchaseFetcher,
  );

  if (isLoading || !id) return INITIAL_STATE;
  if (error) {
    return {
      purchase: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    purchase: data,
    loading: false,
    error: null,
  };
}
