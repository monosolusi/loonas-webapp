"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { BalanceMovementRepositoryImpl } from "@/features/balance/data/repositories/balance-movement";
import { BalanceMovementServiceImpl } from "@/features/balance/data/sources/balance-movement";
import {
  ListBalanceMovementsUseCase,
  ListBalanceMovementsUseCaseParams,
} from "@/features/balance/domain/usecases/list-balance-movements.usecases";
import { BALANCE_SWR_KEYS } from "@/features/balance/presentations/constants/swr-keys";
import {
  ListBalanceMovementFetcherParams,
  UseListBalanceMovementsParams,
  UseListBalanceMovementsReturnType,
} from "@/features/balance/presentations/hooks/use-list-balance-movements.types";

async function ListBalanceMovementFetcher([_, params]: [string, ListBalanceMovementFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const balanceMovementRepository = new BalanceMovementRepositoryImpl(
    new BalanceMovementServiceImpl(new HttpRequest()),
  );
  const useCase = new ListBalanceMovementsUseCase(balanceMovementRepository, sessionRepository);
  const result = await useCase.execute(
    new ListBalanceMovementsUseCaseParams({
      page: params.page,
      limit: params.limit,
    }),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListBalanceMovements(params: UseListBalanceMovementsParams = {}): UseListBalanceMovementsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [BALANCE_SWR_KEYS.LIST_BALANCE_MOVEMENTS, { ...params, clerk }],
    ListBalanceMovementFetcher,
  );

  // Built per render, not as a module constant: a module-level INITIAL_STATE cannot carry
  // this render's `mutate`, and `refresh` must be non-null in every state.
  const initialState: UseListBalanceMovementsReturnType = {
    movements: null,
    meta: null,
    loading: true,
    error: null,
    refresh: mutate,
  };

  if (isLoading) return initialState;
  if (error) {
    return {
      movements: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: mutate,
    };
  }

  if (!data) return initialState;

  return {
    movements: data.data,
    meta: data.meta,
    loading: false,
    error: null,
    refresh: mutate,
  };
}
