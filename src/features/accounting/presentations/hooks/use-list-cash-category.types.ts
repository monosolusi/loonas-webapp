import { useClerk } from "@clerk/nextjs";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import {
  ListCashCategoriesUseCaseParams,
  ListCashCategoriesUseCaseResult,
} from "@/features/accounting/domain/usecases/list-cash-categories.usecases";

export type ListCashCategoryFetcherParams = {
  readonly clerk: ReturnType<typeof useClerk>;
  readonly params: ListCashCategoriesUseCaseParams;
};

type InitialState = {
  readonly categories: null;
  readonly meta: null;
  readonly loading: true;
  readonly isLoadingPage: false;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly categories: CashCategoryEntity[];
  readonly meta: PaginationMeta;
  readonly loading: false;
  readonly isLoadingPage: boolean;
  readonly error: ServerError | null;
  readonly refresh: KeyedMutator<ListCashCategoriesUseCaseResult>;
};

type ErrorState = {
  readonly categories: null;
  readonly meta: null;
  readonly loading: false;
  readonly isLoadingPage: false;
  readonly error: ServerError;
  readonly refresh: KeyedMutator<ListCashCategoriesUseCaseResult>;
};

export type UseListCashCategoriesReturnType = InitialState | LoadedState | ErrorState;
