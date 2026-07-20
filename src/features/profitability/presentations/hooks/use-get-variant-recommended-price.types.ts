import { KeyedMutator } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { VariantRecommendedPriceEntity } from "@/features/profitability/domain/entities/variant-recommended-price";

export type UseGetVariantRecommendedPriceParams = {
  readonly productId: string;
  readonly variantId: string;
  readonly margin: number;
};

export type GetVariantRecommendedPriceFetcherParams = UseGetVariantRecommendedPriceParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly isIncompleteRecipe: false;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: VariantRecommendedPriceEntity;
  readonly loading: false;
  readonly error: null;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantRecommendedPriceEntity>;
};

type IncompleteRecipeState = {
  readonly data: null;
  readonly loading: false;
  readonly error: null;
  readonly isIncompleteRecipe: true;
  readonly refresh: null;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly isIncompleteRecipe: false;
  readonly refresh: null;
};

export type UseGetVariantRecommendedPriceReturnType = InitialState | LoadedState | IncompleteRecipeState | ErrorState;
