"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProfitabilityRepositoryImpl } from "@/features/profitability/data/repositories/profitability";
import { ProfitabilityServiceImpl } from "@/features/profitability/data/sources/profitability";
import {
  GetVariantProductionCostUseCase,
  GetVariantProductionCostUseCaseParams,
} from "@/features/profitability/domain/usecases/get-variant-production-cost.usecases";
import { PROFITABILITY_SWR_KEYS } from "@/features/profitability/presentations/constants/swr-keys";
import {
  GetVariantProductionCostFetcherParams,
  UseGetVariantProductionCostParams,
  UseGetVariantProductionCostReturnType,
} from "@/features/profitability/presentations/hooks/use-get-variant-production-cost.types";

const INITIAL_STATE: UseGetVariantProductionCostReturnType = {
  data: null,
  loading: true,
  error: null,
  isIncompleteRecipe: false,
  refresh: null,
};

async function GetVariantProductionCostFetcher([_, params]: [string, GetVariantProductionCostFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ProfitabilityRepositoryImpl(new ProfitabilityServiceImpl());
  const uc = new GetVariantProductionCostUseCase(repo, sessionRepo);
  const result = await uc.execute(
    new GetVariantProductionCostUseCaseParams(params.productId, params.variantId, params.quantity),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetVariantProductionCost(
  params: UseGetVariantProductionCostParams,
): UseGetVariantProductionCostReturnType {
  const clerk = useClerk();
  const { productId, variantId, quantity } = params;
  const { data, isLoading, error, mutate } = useSWR(
    [PROFITABILITY_SWR_KEYS.GET_VARIANT_PRODUCTION_COST, { productId, variantId, quantity, clerk }],
    GetVariantProductionCostFetcher,
  );

  if (isLoading) return INITIAL_STATE;

  if (error) {
    const serverError = error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN);
    if (serverError.httpCode === 422) {
      return { data: null, loading: false, error: null, isIncompleteRecipe: true, refresh: null };
    }
    return { data: null, loading: false, error: serverError, isIncompleteRecipe: false, refresh: null };
  }

  if (!data) return INITIAL_STATE;

  return {
    data,
    loading: false,
    error: null,
    isIncompleteRecipe: false,
    refresh: mutate,
  };
}
