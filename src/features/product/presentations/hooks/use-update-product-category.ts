"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductCategoryRepositoryImpl } from "@/features/product/data/repositories/product-category";
import { ProductCategoryServiceImpl } from "@/features/product/data/sources/product-category";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { useClerk } from "@clerk/nextjs";

type UpdateCategoryTriggerParams = { id: string; name: string };

type UpdateCategoryFetcherParams = UpdateCategoryTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function UpdateCategoryFetcher(
  _: string,
  { arg }: { arg: UpdateCategoryFetcherParams },
): Promise<ProductCategoryEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const categoryRepository = new ProductCategoryRepositoryImpl(new ProductCategoryServiceImpl(new HttpRequest()));

  const session = await sessionRepository.retrieve();
  if (session instanceof DataFailed) throw session.error;
  if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const result = await categoryRepository.update(arg.id, arg.name, session.data);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useUpdateProductCategory() {
  return useSWRMutationClerk("update-product-category", UpdateCategoryFetcher);
}
