import { KeyedMutator } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { VariantHppEntity } from "@/features/profitability/domain/entities/variant-hpp";

export type UseGetVariantHppParams = {
  readonly productId: string;
  readonly variantId: string;
};

export type GetVariantHppFetcherParams = UseGetVariantHppParams & {
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
  readonly data: VariantHppEntity;
  readonly loading: false;
  readonly error: null;
  readonly isIncompleteRecipe: false;
  readonly refresh: KeyedMutator<VariantHppEntity>;
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

export type UseGetVariantHppReturnType = InitialState | LoadedState | IncompleteRecipeState | ErrorState;
