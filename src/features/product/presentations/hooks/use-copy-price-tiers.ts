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
import { PriceTierCopyResultEntity } from "@/features/product/domain/entities/price-tier-copy-result";
import { TierModeType } from "@/features/product/domain/enums/tier-mode";
import {
  CopyPriceTiersUseCase,
  CopyPriceTiersUseCaseParams,
  CopyPriceTiersUseCaseTier,
} from "@/features/product/domain/usecases/copy-price-tiers.usecases";

type CopyPriceTiersTriggerParams = {
  productId: string;
  tierMode: TierModeType;
  tiers: CopyPriceTiersUseCaseTier[];
};

type CopyPriceTiersFetcherParams = CopyPriceTiersTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function CopyPriceTierFetcher(
  _: string,
  { arg }: { arg: CopyPriceTiersFetcherParams },
): Promise<PriceTierCopyResultEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const priceTierRepository = new PriceTierRepositoryImpl(new PriceTierServiceImpl(new HttpRequest()));
  const copyPriceTiers = new CopyPriceTiersUseCase(priceTierRepository, sessionRepository);

  const result = await copyPriceTiers.execute(new CopyPriceTiersUseCaseParams(arg.productId, arg.tierMode, arg.tiers));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCopyPriceTiers() {
  return useSWRMutationClerk("copy-price-tiers", CopyPriceTierFetcher);
}
