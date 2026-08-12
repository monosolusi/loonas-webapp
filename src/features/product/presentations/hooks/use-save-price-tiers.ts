"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PriceTierRepositoryImpl } from "@/features/product/data/repositories/price-tier";
import { PriceTierServiceImpl } from "@/features/product/data/sources/price-tier";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { TierModeType } from "@/features/product/domain/enums/tier-mode";
import {
  SavePriceTiersUseCase,
  SavePriceTiersUseCaseParams,
  SavePriceTiersUseCaseTier,
} from "@/features/product/domain/usecases/save-price-tiers.usecases";

type SavePriceTiersTriggerParams = {
  productId: string;
  variantId: string;
  tierMode: TierModeType;
  tiers: SavePriceTiersUseCaseTier[];
};

type SavePriceTiersFetcherParams = SavePriceTiersTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function SavePriceTierFetcher(
  _: string,
  { arg }: { arg: SavePriceTiersFetcherParams },
): Promise<PriceTierScheduleEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const priceTierRepository = new PriceTierRepositoryImpl(new PriceTierServiceImpl(new HttpRequest()));
  const savePriceTiers = new SavePriceTiersUseCase(priceTierRepository, sessionRepository);

  const result = await savePriceTiers.execute(
    new SavePriceTiersUseCaseParams(arg.productId, arg.variantId, arg.tierMode, arg.tiers),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useSavePriceTiers() {
  return useSWRMutationClerk("save-price-tiers", SavePriceTierFetcher);
}
