"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductRepositoryImpl } from "@/features/product/data/repositories/product";
import { ProductServiceImpl } from "@/features/product/data/sources/product";
import { useClerk } from "@clerk/nextjs";

type DeleteVariantTriggerParams = { productId: string; variantId: string };

type DeleteVariantFetcherParams = DeleteVariantTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function DeleteVariantFetcher(_: string, { arg }: { arg: DeleteVariantFetcherParams }): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));

  const session = await sessionRepository.retrieve();
  if (session instanceof DataFailed) throw session.error;
  if (!session.data) throw new Error("No session");

  const result = await productRepository.deleteVariant(arg.productId, arg.variantId, session.data);
  if (result instanceof DataFailed) throw result.error;
}

export function useDeleteVariant() {
  return useSWRMutationClerk("delete-variant", DeleteVariantFetcher);
}
