"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductCategoryRepositoryImpl } from "@/features/product/data/repositories/product-category";
import { ProductCategoryServiceImpl } from "@/features/product/data/sources/product-category";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { ListCategoriesParams } from "@/features/product/domain/sources/product-category";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  params: ListCategoriesParams;
};

async function Fetcher([_, fetcherParams]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fetcherParams.clerk }));
  const categoryRepository = new ProductCategoryRepositoryImpl(new ProductCategoryServiceImpl(new HttpRequest()));

  const session = await sessionRepository.retrieve();
  if (session instanceof DataFailed) throw session.error;
  if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const result = await categoryRepository.listPaginated(fetcherParams.params, session.data);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

type UseListProductCategoriesPaginatedParams = {
  page?: number;
  limit?: number;
  search?: string;
};

type UseListProductCategoriesPaginatedReturnType = {
  categories: ProductCategoryEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: ServerError | null;
};

export function useListProductCategoriesPaginated(
  params: UseListProductCategoriesPaginatedParams = {},
): UseListProductCategoriesPaginatedReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    ["list-product-categories-paginated", { clerk, params }],
    Fetcher,
  );

  return {
    categories: data?.categories ?? [],
    meta: data?.meta ?? null,
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
