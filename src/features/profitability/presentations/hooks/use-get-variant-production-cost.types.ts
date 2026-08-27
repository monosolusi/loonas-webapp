import { KeyedMutator } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { VariantProductionCostEntity } from "@/features/profitability/domain/entities/variant-production-cost";

export type UseGetVariantProductionCostParams = {
  readonly productId: string;
  readonly variantId: string;
  readonly quantity: number;
};

export type GetVariantProductionCostFetcherParams = UseGetVariantProductionCostParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantProductionCostEntity>;
};

type LoadedState = {
  readonly data: VariantProductionCostEntity;
  readonly loading: false;
  readonly error: null;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantProductionCostEntity>;
};

type IncompleteRecipeState = {
  readonly data: null;
  readonly loading: false;
  readonly error: null;
  readonly isIncompleteRecipe: true;
  readonly refresh: KeyedMutator<VariantProductionCostEntity>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantProductionCostEntity>;
};

export type UseGetVariantProductionCostReturnType = InitialState | LoadedState | IncompleteRecipeState | ErrorState;
