"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductionPreviewRepositoryImpl } from "@/features/production/data/repositories/production-preview";
import { ProductionPreviewServiceImpl } from "@/features/production/data/sources/production-preview";
import { ProductionPreviewEntity } from "@/features/production/domain/entities/production-preview";
import {
  PreviewProductionUseCase,
  PreviewProductionUseCaseParams,
} from "@/features/production/domain/usecases/preview-production.usecases";
import { PRODUCTION_SWR_KEYS } from "@/features/production/presentations/constants/swr-keys";

type UsePreviewProductionParams = {
  productId: string | null;
  variantId: string | null;
  quantity: number;
};

type UsePreviewProductionReturnType = {
  preview: ProductionPreviewEntity | null;
  loading: boolean;
  error: ServerError | null;
};

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  productId: string;
  variantId: string;
  quantity: number;
};

async function PreviewProductionFetcher([_, params]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const previewRepository = new ProductionPreviewRepositoryImpl(new ProductionPreviewServiceImpl(new HttpRequest()));
  const useCase = new PreviewProductionUseCase(previewRepository, sessionRepository);
  const result = await useCase.execute(
    new PreviewProductionUseCaseParams({
      productId: params.productId,
      variantId: params.variantId,
      quantity: params.quantity,
    }),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function usePreviewProduction({ productId, variantId, quantity }: UsePreviewProductionParams): UsePreviewProductionReturnType {
  const clerk = useClerk();
  const shouldFetch = productId && variantId && quantity > 0;

  const { data, isLoading, error } = useSWR(
    shouldFetch ? [PRODUCTION_SWR_KEYS.PREVIEW_PRODUCTION, { clerk, productId, variantId, quantity }] : null,
    PreviewProductionFetcher,
  );

  return {
    preview: data ?? null,
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
