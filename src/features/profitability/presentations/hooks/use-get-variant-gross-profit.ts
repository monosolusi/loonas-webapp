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
  GetVariantGrossProfitUseCase,
  GetVariantGrossProfitUseCaseParams,
} from "@/features/profitability/domain/usecases/get-variant-gross-profit.usecases";
import { PROFITABILITY_SWR_KEYS } from "@/features/profitability/presentations/constants/swr-keys";
import {
  GetVariantGrossProfitFetcherParams,
  UseGetVariantGrossProfitParams,
  UseGetVariantGrossProfitReturnType,
} from "@/features/profitability/presentations/hooks/use-get-variant-gross-profit.types";

const INITIAL_STATE: UseGetVariantGrossProfitReturnType = {
  data: null,
  loading: true,
  error: null,
  isIncompleteRecipe: false,
  refresh: null,
};

async function GetVariantGrossProfitFetcher([_, params]: [string, GetVariantGrossProfitFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ProfitabilityRepositoryImpl(new ProfitabilityServiceImpl());
  const uc = new GetVariantGrossProfitUseCase(repo, sessionRepo);
  const result = await uc.execute(new GetVariantGrossProfitUseCaseParams(params.productId, params.variantId));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetVariantGrossProfit(params: UseGetVariantGrossProfitParams): UseGetVariantGrossProfitReturnType {
  const clerk = useClerk();
  const { productId, variantId } = params;
  const { data, isLoading, error, mutate } = useSWR(
    [PROFITABILITY_SWR_KEYS.GET_VARIANT_GROSS_PROFIT, { productId, variantId, clerk }],
    GetVariantGrossProfitFetcher,
  );

  if (isLoading) return INITIAL_STATE;

  if (error) {
    const serverError = error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN);
    // 422 = incomplete recipe — this is a needs-data state, not a retriable error
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
