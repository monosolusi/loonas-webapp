"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductRepositoryImpl } from "@/features/product/data/repositories/product";
import { ProductServiceImpl } from "@/features/product/data/sources/product";
import { DeleteProductUseCase, DeleteProductUseCaseParams } from "@/features/product/domain/usecases/delete-product.usecases";
import { useClerk } from "@clerk/nextjs";

type DeleteProductTriggerParams = { id: string };

type DeleteProductFetcherParams = DeleteProductTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function DeleteProductFetcher(_: string, { arg }: { arg: DeleteProductFetcherParams }): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));
  const deleteProduct = new DeleteProductUseCase(productRepository, sessionRepository);

  const result = await deleteProduct.execute(new DeleteProductUseCaseParams(arg.id));
  if (result instanceof DataFailed) throw result.error;
}

export function useDeleteProduct() {
  return useSWRMutationClerk("delete-product", DeleteProductFetcher);
}
