"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { StockItemRepositoryImpl } from "@/features/inventory/data/repositories/stock-item";
import { StockItemServiceImpl } from "@/features/inventory/data/sources/stock-item";
import {
  ListNegativeStockItemsUseCase,
  ListNegativeStockItemsUseCaseParams,
} from "@/features/inventory/domain/usecases/list-negative-stock-items.usecases";
import { INVENTORY_SWR_KEYS } from "@/features/inventory/presentations/constants/swr-keys";
import {
  ListStockItemFetcherParams,
  UseListStockItemsParams,
  UseListStockItemsReturnType,
} from "@/features/inventory/presentations/hooks/use-list-stock-items.types";

const INITIAL_STATE: UseListStockItemsReturnType = {
  stockItems: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListNegativeStockItemFetcher([_, params]: [string, ListStockItemFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const stockItemRepository = new StockItemRepositoryImpl(new StockItemServiceImpl(new HttpRequest()));
  const useCase = new ListNegativeStockItemsUseCase(stockItemRepository, sessionRepository);
  const result = await useCase.execute(
    new ListNegativeStockItemsUseCaseParams({
      page: params.page,
      limit: params.limit,
    }),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListNegativeStockItems(params: UseListStockItemsParams = {}): UseListStockItemsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [INVENTORY_SWR_KEYS.LIST_NEGATIVE_STOCK_ITEMS, { ...params, clerk }],
    ListNegativeStockItemFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      stockItems: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    stockItems: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}