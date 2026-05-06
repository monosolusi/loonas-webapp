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
import { ListProductsForSaleResult } from "@/features/product/domain/repositories/product";
import {
  ListProductsForSaleUseCase,
  ListProductsForSaleUseCaseParams,
} from "@/features/product/domain/usecases/list-products-for-sale.usecases";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import {
  ListProductsForSaleFetcherParams,
  UseListProductsForSaleState,
} from "@/features/product/presentations/hooks/use-list-products-for-sale.types";

async function ListProductForSaleFetcher([_, params]: [string, ListProductsForSaleFetcherParams]): Promise<ListProductsForSaleResult> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));
  const listProducts = new ListProductsForSaleUseCase(productRepository, sessionRepository);

  const result = await listProducts.execute(
    new ListProductsForSaleUseCaseParams(params.page, params.limit, params.categoryIds, params.search),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type UseListProductsForSaleParams = {
  page?: number;
  limit?: number;
  categoryIds?: string[];
  search?: string;
};

export function useListProductsForSale(params: UseListProductsForSaleParams = {}): UseListProductsForSaleState {
  const clerk = useClerk();

  const { data, error } = useSWR(
    [PRODUCT_SWR_KEYS.LIST_PRODUCTS_FOR_SALE, { clerk, ...params }],
    ListProductForSaleFetcher,
  );

  if (error) {
    const serverError = error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN, { error });
    return { status: "error", products: null, meta: null, error: serverError };
  }
  if (!data) return { status: "loading", products: null, meta: null, error: null };
  return { status: "loaded", products: data.products, meta: data.meta, error: null };
}
