"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PurchasableItemRepositoryImpl } from "@/features/purchasing/data/repositories/purchasable-item";
import { PurchasableItemServiceImpl } from "@/features/purchasing/data/sources/purchasable-item";
import {
  ListPurchasableItemsUseCase,
  ListPurchasableItemsUseCaseParams,
} from "@/features/purchasing/domain/usecases/list-purchasable-items.usecases";
import { PURCHASE_SWR_KEYS } from "@/features/purchasing/presentations/constants/swr-keys";
import {
  ListPurchasableItemFetcherParams,
  UseListPurchasableItemsParams,
  UseListPurchasableItemsReturnType,
} from "@/features/purchasing/presentations/hooks/use-list-purchasable-items.types";

const INITIAL_STATE: UseListPurchasableItemsReturnType = {
  items: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListPurchasableItemFetcher([_, params]: [string, ListPurchasableItemFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const purchasableItemRepository = new PurchasableItemRepositoryImpl(new PurchasableItemServiceImpl(new HttpRequest()));
  const useCase = new ListPurchasableItemsUseCase(purchasableItemRepository, sessionRepository);
  const result = await useCase.execute(new ListPurchasableItemsUseCaseParams({ page: params.page, limit: params.limit }));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListPurchasableItems(params: UseListPurchasableItemsParams = {}): UseListPurchasableItemsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [PURCHASE_SWR_KEYS.LIST_PURCHASABLE_ITEMS, { ...params, clerk }],
    ListPurchasableItemFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      items: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    items: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
