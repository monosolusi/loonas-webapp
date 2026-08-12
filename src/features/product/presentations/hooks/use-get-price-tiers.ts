"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PriceTierRepositoryImpl } from "@/features/product/data/repositories/price-tier";
import { PriceTierServiceImpl } from "@/features/product/data/sources/price-tier";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import {
  GetPriceTiersUseCase,
  GetPriceTiersUseCaseParams,
} from "@/features/product/domain/usecases/get-price-tiers.usecases";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import {
  GetPriceTiersFetcherParams,
  UseGetPriceTiersState,
} from "@/features/product/presentations/hooks/use-get-price-tiers.types";

async function GetPriceTierFetcher([_, params]: [string, GetPriceTiersFetcherParams]): Promise<PriceTierScheduleEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const priceTierRepository = new PriceTierRepositoryImpl(new PriceTierServiceImpl(new HttpRequest()));
  const getPriceTiers = new GetPriceTiersUseCase(priceTierRepository, sessionRepository);

  const result = await getPriceTiers.execute(new GetPriceTiersUseCaseParams(params.productId, params.variantId));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type UseGetPriceTiersParams = {
  productId: string;
  /** `null` skips the fetch entirely — used while no variant editor is open. */
  variantId: string | null;
};

export function useGetPriceTiers(params: UseGetPriceTiersParams): UseGetPriceTiersState {
  const clerk = useClerk();

  const { data, error, mutate } = useSWR(
    params.variantId
      ? [PRODUCT_SWR_KEYS.GET_PRICE_TIERS, { clerk, productId: params.productId, variantId: params.variantId }]
      : null,
    GetPriceTierFetcher,
  );

  const refresh = () => {
    void mutate();
  };

  if (error) {
    const serverError = error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN, { error });
    return { status: "error", schedule: null, error: serverError, refresh };
  }
  if (!data) return { status: "loading", schedule: null, error: null, refresh };
  return { status: "loaded", schedule: data, error: null, refresh };
}
