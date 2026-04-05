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
import { ListPurchasesUseCase, ListPurchasesUseCaseParams } from "@/features/purchasing/domain/usecases/list-purchases.usecases";
import { PURCHASE_SWR_KEYS } from "@/features/purchasing/presentations/constants/swr-keys";
import {
  ListPurchaseFetcherParams,
  UseListPurchasesParams,
  UseListPurchasesReturnType,
} from "@/features/purchasing/presentations/hooks/use-list-purchases.types";

const INITIAL_STATE: UseListPurchasesReturnType = {
  purchases: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListPurchaseFetcher([_, params]: [string, ListPurchaseFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const purchaseRepository = new PurchaseRepositoryImpl(new PurchaseServiceImpl(new HttpRequest()));
  const useCase = new ListPurchasesUseCase(purchaseRepository, sessionRepository);
  const result = await useCase.execute(new ListPurchasesUseCaseParams({ page: params.page, limit: params.limit }));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListPurchases(params: UseListPurchasesParams = {}): UseListPurchasesReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [PURCHASE_SWR_KEYS.LIST_PURCHASES, { ...params, clerk }],
    ListPurchaseFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      purchases: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    purchases: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
