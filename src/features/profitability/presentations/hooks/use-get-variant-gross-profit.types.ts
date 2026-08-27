import { KeyedMutator } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { VariantGrossProfitEntity } from "@/features/profitability/domain/entities/variant-gross-profit";

export type UseGetVariantGrossProfitParams = {
  readonly productId: string;
  readonly variantId: string;
};

export type GetVariantGrossProfitFetcherParams = UseGetVariantGrossProfitParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantGrossProfitEntity>;
};

type LoadedState = {
  readonly data: VariantGrossProfitEntity;
  readonly loading: false;
  readonly error: null;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantGrossProfitEntity>;
};

type IncompleteRecipeState = {
  readonly data: null;
  readonly loading: false;
  readonly error: null;
  readonly isIncompleteRecipe: true;
  readonly refresh: KeyedMutator<VariantGrossProfitEntity>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantGrossProfitEntity>;
};

export type UseGetVariantGrossProfitReturnType = InitialState | LoadedState | IncompleteRecipeState | ErrorState;
