"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductRepositoryImpl } from "@/features/product/data/repositories/product";
import { ProductServiceImpl } from "@/features/product/data/sources/product";
import { UpdateProductUseCase, UpdateProductUseCaseParams } from "@/features/product/domain/usecases/update-product.usecases";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { UpdateProductParams } from "@/features/product/domain/repositories/product";
import { useClerk } from "@clerk/nextjs";

type UpdateProductTriggerParams = {
  id: string;
} & UpdateProductParams;

type UpdateProductFetcherParams = UpdateProductTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function UpdateProductFetcher(_: string, { arg }: { arg: UpdateProductFetcherParams }): Promise<ProductEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));
  const updateProduct = new UpdateProductUseCase(productRepository, sessionRepository);

  const result = await updateProduct.execute(
    new UpdateProductUseCaseParams(arg.id, {
      name: arg.name,
      sku: arg.sku,
      status: arg.status,
      categoryId: arg.categoryId,
    }),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useUpdateProduct() {
  return useSWRMutationClerk("update-product", UpdateProductFetcher);
}
