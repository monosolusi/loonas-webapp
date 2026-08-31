"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { BalanceRepositoryImpl } from "@/features/balance/data/repositories/balance";
import { BalanceServiceImpl } from "@/features/balance/data/sources/balance";
import { GetBalanceUseCase } from "@/features/balance/domain/usecases/get-balance.usecases";
import { BALANCE_SWR_KEYS } from "@/features/balance/presentations/constants/swr-keys";
import {
  GetBalanceFetcherParams,
  UseGetBalanceReturnType,
} from "@/features/balance/presentations/hooks/use-get-balance.types";

async function GetBalanceFetcher([_, params]: [string, GetBalanceFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const balanceRepository = new BalanceRepositoryImpl(new BalanceServiceImpl(new HttpRequest()));
  const useCase = new GetBalanceUseCase(balanceRepository, sessionRepository);
  const result = await useCase.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetBalance(): UseGetBalanceReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR([BALANCE_SWR_KEYS.GET_BALANCE, { clerk }], GetBalanceFetcher);

  // Built per render, not as a module constant: a module-level INITIAL_STATE cannot carry
  // this render's `mutate`, and `refresh` must be non-null in every state.
  const initialState: UseGetBalanceReturnType = {
    balance: null,
    loading: true,
    error: null,
    refresh: mutate,
  };

  if (isLoading) return initialState;
  if (error) {
    return {
      balance: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: mutate,
    };
  }

  if (!data) return initialState;

  return {
    balance: data,
    loading: false,
    error: null,
    refresh: mutate,
  };
}
