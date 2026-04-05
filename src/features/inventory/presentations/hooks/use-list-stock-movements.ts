"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { StockMovementRepositoryImpl } from "@/features/inventory/data/repositories/stock-movement";
import { StockMovementServiceImpl } from "@/features/inventory/data/sources/stock-movement";
import {
  ListStockMovementsUseCase,
  ListStockMovementsUseCaseParams,
} from "@/features/inventory/domain/usecases/list-stock-movements.usecases";
import { INVENTORY_SWR_KEYS } from "@/features/inventory/presentations/constants/swr-keys";
import {
  ListStockMovementFetcherParams,
  UseListStockMovementsParams,
  UseListStockMovementsReturnType,
} from "@/features/inventory/presentations/hooks/use-list-stock-movements.types";

const INITIAL_STATE: UseListStockMovementsReturnType = {
  movements: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListStockMovementFetcher([_, params]: [string, ListStockMovementFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const stockMovementRepository = new StockMovementRepositoryImpl(new StockMovementServiceImpl(new HttpRequest()));
  const useCase = new ListStockMovementsUseCase(stockMovementRepository, sessionRepository);
  const result = await useCase.execute(
    new ListStockMovementsUseCaseParams({
      stockItemId: params.stockItemId,
      type: params.type,
      page: params.page,
      limit: params.limit,
    }),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListStockMovements(params: UseListStockMovementsParams = {}): UseListStockMovementsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [INVENTORY_SWR_KEYS.LIST_STOCK_MOVEMENTS, { ...params, clerk }],
    ListStockMovementFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      movements: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    movements: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
