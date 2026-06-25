"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ManagerialCostRepositoryImpl } from "@/features/accounting/data/repositories/managerial-cost";
import { ManagerialCostServiceImpl } from "@/features/accounting/data/sources/managerial-cost";
import { GetManagerialCostUseCase, GetManagerialCostUseCaseParams } from "@/features/accounting/domain/usecases/get-managerial-cost.usecases";
import { ManagerialCostProjectionEntity } from "@/features/accounting/domain/entities/managerial-cost-projection";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  periodId: string;
  variantId?: string;
};

async function GetManagerialCostFetcher([_, fp]: [string, FetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new ManagerialCostRepositoryImpl(new ManagerialCostServiceImpl(new HttpRequest()));
  const uc = new GetManagerialCostUseCase(repo, sessionRepo);
  const result = await uc.execute(new GetManagerialCostUseCaseParams(fp.periodId, fp.variantId));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type UseGetManagerialCostParams = {
  periodId: string;
  variantId?: string;
  enabled?: boolean;
};

type InitialState = { status: "initial"; projections: []; isAllocated: false; loading: false; error: null };
type LoadingState = { status: "loading"; projections: []; isAllocated: false; loading: true; error: null };
type LoadedState = {
  status: "loaded";
  projections: ManagerialCostProjectionEntity[];
  isAllocated: boolean;
  loading: false;
  error: null;
};
type ErrorState = { status: "error"; projections: []; isAllocated: false; loading: false; error: ServerError };

export type UseGetManagerialCostState = InitialState | LoadingState | LoadedState | ErrorState;

export function useGetManagerialCost({ periodId, variantId, enabled = true }: UseGetManagerialCostParams): UseGetManagerialCostState {
  const clerk = useClerk();
  const swrKey = enabled ? [ACCOUNTING_SWR_KEYS.GET_MANAGERIAL_COST, { clerk, periodId, variantId }] : null;

  const { data, isLoading, error } = useSWR(swrKey, GetManagerialCostFetcher);

  if (!enabled) {
    return { status: "initial", projections: [], isAllocated: false, loading: false, error: null };
  }

  if (isLoading) {
    return { status: "loading", projections: [], isAllocated: false, loading: true, error: null };
  }

  if (error) {
    return {
      status: "error",
      projections: [],
      isAllocated: false,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN, { error }),
    };
  }

  if (data !== undefined) {
    return {
      status: "loaded",
      projections: data,
      isAllocated: data.length > 0,
      loading: false,
      error: null,
    };
  }

  return { status: "initial", projections: [], isAllocated: false, loading: false, error: null };
}
