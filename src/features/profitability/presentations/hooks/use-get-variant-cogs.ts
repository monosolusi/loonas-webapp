"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProfitabilityRepositoryImpl } from "@/features/profitability/data/repositories/profitability";
import { ProfitabilityServiceImpl } from "@/features/profitability/data/sources/profitability";
import { GetVariantCogsUseCase, GetVariantCogsUseCaseParams } from "@/features/profitability/domain/usecases/get-variant-cogs.usecases";
import { PROFITABILITY_SWR_KEYS } from "@/features/profitability/presentations/constants/swr-keys";
import {
  UseGetVariantCogsParams,
  UseGetVariantCogsReturnType,
} from "@/features/profitability/presentations/hooks/use-get-variant-cogs.types";

async function GetVariantCogsFetcher(
  [_, params]: [string, UseGetVariantCogsParams],
  clerk: ReturnType<typeof useClerk>,
) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
  const repo = new ProfitabilityRepositoryImpl(new ProfitabilityServiceImpl());
  const uc = new GetVariantCogsUseCase(repo, sessionRepo);
  const result = await uc.execute(new GetVariantCogsUseCaseParams(params.productId, params.variantId));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetVariantCogs(params: UseGetVariantCogsParams): UseGetVariantCogsReturnType {
  const clerk = useClerk();
  const { productId, variantId } = params;
  const { data, isLoading, error, mutate } = useSWR(
    [PROFITABILITY_SWR_KEYS.GET_VARIANT_COGS, { productId, variantId }],
    (key) => GetVariantCogsFetcher(key, clerk),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: (err) => {
        const serverError = err instanceof ServerError ? err : null;
        // 422 = incomplete recipe; retrying will never succeed and only flashes skeletons.
        if (serverError?.httpCode === 422) return false;
        return true;
      },
    },
  );

  const initialState: UseGetVariantCogsReturnType = {
    data: null,
    loading: true,
    error: null,
    isIncompleteRecipe: false,
    refresh: mutate,
  };

  if (isLoading) return initialState;

  if (error) {
    const serverError = error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN);
    if (serverError.httpCode === 422) {
      return { data: null, loading: false, error: null, isIncompleteRecipe: true, refresh: mutate };
    }
    return { data: null, loading: false, error: serverError, isIncompleteRecipe: false, refresh: mutate };
  }

  if (!data) return initialState;

  return {
    data,
    loading: false,
    error: null,
    isIncompleteRecipe: false,
    refresh: mutate,
  };
}
