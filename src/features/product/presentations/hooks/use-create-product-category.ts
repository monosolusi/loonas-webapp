"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductCategoryRepositoryImpl } from "@/features/product/data/repositories/product-category";
import { ProductCategoryServiceImpl } from "@/features/product/data/sources/product-category";
import {
  CreateProductCategoryUseCase,
  CreateProductCategoryUseCaseParams,
} from "@/features/product/domain/usecases/create-product-category.usecases";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { useClerk } from "@clerk/nextjs";

type CreateCategoryTriggerParams = { name: string };

type CreateCategoryFetcherParams = CreateCategoryTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function CreateCategoryFetcher(
  _: string,
  { arg }: { arg: CreateCategoryFetcherParams },
): Promise<ProductCategoryEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const categoryRepository = new ProductCategoryRepositoryImpl(new ProductCategoryServiceImpl(new HttpRequest()));
  const createCategory = new CreateProductCategoryUseCase(categoryRepository, sessionRepository);

  const result = await createCategory.execute(new CreateProductCategoryUseCaseParams(arg.name));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useCreateProductCategory() {
  return useSWRMutationClerk("create-product-category", CreateCategoryFetcher);
}
