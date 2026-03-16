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
import { GetProductUseCase, GetProductUseCaseParams } from "@/features/product/domain/usecases/get-product.usecases";
import { ProductEntity } from "@/features/product/domain/entities/product";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  id: string;
};

async function GetProductFetcher([_, params]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));
  const getProduct = new GetProductUseCase(productRepository, sessionRepository);

  const result = await getProduct.execute(new GetProductUseCaseParams(params.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

type UseGetProductReturnType = {
  product: ProductEntity | null;
  loading: boolean;
  error: ServerError | null;
};

export function useGetProduct(id: string): UseGetProductReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    ["get-product", { clerk, id }],
    GetProductFetcher,
  );

  return {
    product: data ?? null,
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
