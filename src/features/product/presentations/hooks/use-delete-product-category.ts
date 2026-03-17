"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductCategoryRepositoryImpl } from "@/features/product/data/repositories/product-category";
import { ProductCategoryServiceImpl } from "@/features/product/data/sources/product-category";
import { useClerk } from "@clerk/nextjs";

type DeleteCategoryTriggerParams = { id: string };

type DeleteCategoryFetcherParams = DeleteCategoryTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function DeleteCategoryFetcher(_: string, { arg }: { arg: DeleteCategoryFetcherParams }): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const categoryRepository = new ProductCategoryRepositoryImpl(new ProductCategoryServiceImpl(new HttpRequest()));

  const session = await sessionRepository.retrieve();
  if (session instanceof DataFailed) throw session.error;
  if (!session.data) throw new Error("No session");

  const result = await categoryRepository.delete(arg.id, session.data);
  if (result instanceof DataFailed) throw result.error;
}

export function useDeleteProductCategory() {
  return useSWRMutationClerk("delete-product-category", DeleteCategoryFetcher);
}
