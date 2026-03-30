"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductRepositoryImpl } from "@/features/product/data/repositories/product";
import { ProductServiceImpl } from "@/features/product/data/sources/product";
import {
  SaveRecipeUseCase,
  SaveRecipeUseCaseParams,
} from "@/features/product/domain/usecases/save-recipe.usecases";
import { SaveRecipeParams } from "@/features/product/domain/repositories/product";
import { useClerk } from "@clerk/nextjs";

type SaveRecipeTriggerParams = {
  productId: string;
  variantId: string;
} & SaveRecipeParams;

type SaveRecipeFetcherParams = SaveRecipeTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function SaveRecipeFetcher(_: string, { arg }: { arg: SaveRecipeFetcherParams }): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));
  const saveRecipe = new SaveRecipeUseCase(productRepository, sessionRepository);

  const result = await saveRecipe.execute(
    new SaveRecipeUseCaseParams(arg.productId, arg.variantId, { items: arg.items }),
  );
  if (result instanceof DataFailed) throw result.error;
}

export function useSaveRecipe() {
  return useSWRMutationClerk("save-recipe", SaveRecipeFetcher);
}
