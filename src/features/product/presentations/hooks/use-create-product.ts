"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductRepositoryImpl } from "@/features/product/data/repositories/product";
import { ProductServiceImpl } from "@/features/product/data/sources/product";
import { CreateProductUseCase, CreateProductUseCaseParams } from "@/features/product/domain/usecases/create-product.usecases";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { CreateProductParams } from "@/features/product/domain/repositories/product";
import { useClerk } from "@clerk/nextjs";

type CreateProductTriggerParams = CreateProductParams;

type CreateProductFetcherParams = CreateProductTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function CreateProductFetcher(_: string, { arg }: { arg: CreateProductFetcherParams }): Promise<ProductEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));
  const createProduct = new CreateProductUseCase(productRepository, sessionRepository);

  const result = await createProduct.execute(
    new CreateProductUseCaseParams({
      name: arg.name,
      sku: arg.sku,
      status: arg.status,
      categoryId: arg.categoryId,
      variants: arg.variants,
    }),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useCreateProduct() {
  return useSWRMutationClerk("create-product", CreateProductFetcher);
}
