"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductCategoryRepositoryImpl } from "@/features/product/data/repositories/product-category";
import { ProductCategoryServiceImpl } from "@/features/product/data/sources/product-category";
import {
  ListProductCategoriesUseCase,
  ListProductCategoriesUseCaseParams,
} from "@/features/product/domain/usecases/list-product-categories.usecases";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  search?: string;
};

async function ListCategoriesFetcher([_, params]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const categoryRepository = new ProductCategoryRepositoryImpl(new ProductCategoryServiceImpl(new HttpRequest()));
  const listCategories = new ListProductCategoriesUseCase(categoryRepository, sessionRepository);

  const result = await listCategories.execute(new ListProductCategoriesUseCaseParams(params.search));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

type UseListProductCategoriesReturnType = {
  categories: ProductCategoryEntity[];
  loading: boolean;
  error: ServerError | null;
};

export function useListProductCategories(search?: string): UseListProductCategoriesReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [PRODUCT_SWR_KEYS.LIST_PRODUCT_CATEGORIES, { clerk, search }],
    ListCategoriesFetcher,
  );

  return {
    categories: data ?? [],
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
