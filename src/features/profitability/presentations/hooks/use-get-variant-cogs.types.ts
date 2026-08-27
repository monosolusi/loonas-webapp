import { KeyedMutator } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { VariantCogsEntity } from "@/features/profitability/domain/entities/variant-cogs";

export type UseGetVariantCogsParams = {
  readonly productId: string;
  readonly variantId: string;
};

export type GetVariantCogsFetcherParams = UseGetVariantCogsParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantCogsEntity>;
};

type LoadedState = {
  readonly data: VariantCogsEntity;
  readonly loading: false;
  readonly error: null;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantCogsEntity>;
};

type IncompleteRecipeState = {
  readonly data: null;
  readonly loading: false;
  readonly error: null;
  readonly isIncompleteRecipe: true;
  readonly refresh: KeyedMutator<VariantCogsEntity>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantCogsEntity>;
};

export type UseGetVariantCogsReturnType = InitialState | LoadedState | IncompleteRecipeState | ErrorState;
