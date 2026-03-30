"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductRepositoryImpl } from "@/features/product/data/repositories/product";
import { ProductServiceImpl } from "@/features/product/data/sources/product";
import { RecipeItemEntity } from "@/features/product/domain/entities/recipe-item";
import { GetRecipeUseCase, GetRecipeUseCaseParams } from "@/features/product/domain/usecases/get-recipe.usecases";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  productId: string;
  variantId: string;
};

async function Fetcher([_, fetcherParams]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fetcherParams.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));
  const getRecipe = new GetRecipeUseCase(productRepository, sessionRepository);

  const result = await getRecipe.execute(new GetRecipeUseCaseParams(fetcherParams.productId, fetcherParams.variantId));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

type UseGetRecipeReturnType = {
  recipeItems: RecipeItemEntity[];
  loading: boolean;
  error: ServerError | null;
};

export function useGetRecipe(productId: string, variantId: string | null): UseGetRecipeReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    variantId ? [PRODUCT_SWR_KEYS.GET_RECIPE, { clerk, productId, variantId }] : null,
    Fetcher,
  );

  return {
    recipeItems: data ?? [],
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
