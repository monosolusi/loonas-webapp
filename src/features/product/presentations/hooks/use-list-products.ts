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
import { ListProductsUseCase, ListProductsUseCaseParams } from "@/features/product/domain/usecases/list-products.usecases";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";

type UseListProductsParams = {
  page?: number;
  limit?: number;
  type?: string;
  categoryIds?: string[];
  status?: string;
  search?: string;
};

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  params: UseListProductsParams;
};

async function ListProductsFetcher([_, fetcherParams]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fetcherParams.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));
  const listProducts = new ListProductsUseCase(productRepository, sessionRepository);

  const result = await listProducts.execute(new ListProductsUseCaseParams(fetcherParams.params));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

type UseListProductsReturnType = {
  products: ProductEntity[];
  meta: { page: number; limit: number; total: number; totalPages: number } | null;
  loading: boolean;
  error: ServerError | null;
};

export function useListProducts(params: UseListProductsParams = {}): UseListProductsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [PRODUCT_SWR_KEYS.LIST_PRODUCTS, { clerk, params }],
    ListProductsFetcher,
  );

  return {
    products: data?.products ?? [],
    meta: data?.meta ?? null,
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
