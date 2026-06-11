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
import { GetStockItemUseCase, GetStockItemUseCaseParams } from "@/features/inventory/domain/usecases/get-stock-item.usecases";
import { INVENTORY_SWR_KEYS } from "@/features/inventory/presentations/constants/swr-keys";
import { UseGetStockItemReturnType } from "@/features/inventory/presentations/hooks/use-get-stock-item.types";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  id: string;
};

const INITIAL_STATE: UseGetStockItemReturnType = {
  stockItem: null,
  loading: true,
  error: null,
};

async function GetStockItemFetcher([_, params]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const stockItemRepository = new StockItemRepositoryImpl(new StockItemServiceImpl(new HttpRequest()));
  const useCase = new GetStockItemUseCase(stockItemRepository, sessionRepository);
  const result = await useCase.execute(new GetStockItemUseCaseParams(params.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetStockItem(id: string | null): UseGetStockItemReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    id ? [INVENTORY_SWR_KEYS.GET_STOCK_ITEM, { clerk, id }] : null,
    GetStockItemFetcher,
  );

  if (isLoading || !id) return INITIAL_STATE;
  if (error) {
    return {
      stockItem: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    stockItem: data,
    loading: false,
    error: null,
  };
}
