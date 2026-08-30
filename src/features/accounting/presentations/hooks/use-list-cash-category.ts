"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CashCategoryRepositoryImpl } from "@/features/accounting/data/repositories/cash-category";
import { CashCategoryServiceImpl } from "@/features/accounting/data/sources/cash-category";
import {
  ListCashCategoriesUseCase,
  ListCashCategoriesUseCaseParams,
} from "@/features/accounting/domain/usecases/list-cash-categories.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListCashCategoryFetcherParams,
  UseListCashCategoriesReturnType,
} from "@/features/accounting/presentations/hooks/use-list-cash-category.types";

const INITIAL_STATE: UseListCashCategoriesReturnType = {
  categories: null,
  meta: null,
  loading: true,
  isLoadingPage: false,
  error: null,
  refresh: null,
};

async function ListCashCategoryFetcher([_, fp]: [string, ListCashCategoryFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new CashCategoryRepositoryImpl(new CashCategoryServiceImpl(new HttpRequest()));
  const uc = new ListCashCategoriesUseCase(repo, sessionRepo);
  const result = await uc.execute(fp.params);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListCashCategories(params: ListCashCategoriesUseCaseParams = {}): UseListCashCategoriesReturnType {
  const clerk = useClerk();
  const { data, isLoading, isValidating, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.LIST_CASH_CATEGORIES, { clerk, params }],
    ListCashCategoryFetcher,
    { keepPreviousData: true },
  );

  const swrError = error instanceof ServerError ? error : error ? new ServerError(ErrorCodes.UNKNOWN) : null;

  if (isLoading && !data) return INITIAL_STATE;
  if (swrError && !data) {
    return {
      categories: null,
      meta: null,
      loading: false,
      isLoadingPage: false,
      error: swrError,
      refresh: () => mutate(),
    };
  }
  if (!data) return INITIAL_STATE;

  return {
    categories: data.categories,
    meta: data.meta,
    loading: false,
    isLoadingPage: isValidating,
    error: swrError,
    refresh: mutate,
  };
}
