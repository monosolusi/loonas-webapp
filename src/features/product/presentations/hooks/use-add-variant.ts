"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductRepositoryImpl } from "@/features/product/data/repositories/product";
import { ProductServiceImpl } from "@/features/product/data/sources/product";
import { AddVariantParams } from "@/features/product/domain/repositories/product";
import { useClerk } from "@clerk/nextjs";

type AddVariantTriggerParams = { productId: string } & AddVariantParams;

type AddVariantFetcherParams = AddVariantTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function AddVariantFetcher(_: string, { arg }: { arg: AddVariantFetcherParams }): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));

  const session = await sessionRepository.retrieve();
  if (session instanceof DataFailed) throw session.error;
  if (!session.data) throw new Error("No session");

  const result = await productRepository.addVariant(arg.productId, { name: arg.name, sku: arg.sku, price: arg.price }, session.data);
  if (result instanceof DataFailed) throw result.error;
}

export function useAddVariant() {
  return useSWRMutationClerk("add-variant", AddVariantFetcher);
}
