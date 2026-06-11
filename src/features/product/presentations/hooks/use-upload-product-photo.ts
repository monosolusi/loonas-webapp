"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductRepositoryImpl } from "@/features/product/data/repositories/product";
import { ProductServiceImpl } from "@/features/product/data/sources/product";
import { ProductPhotoEntity } from "@/features/product/domain/entities/product-photo";
import { useClerk } from "@clerk/nextjs";

type UploadPhotoTriggerParams = {
  productId: string;
  file: File;
};

type UploadPhotoFetcherParams = UploadPhotoTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function UploadPhotoFetcher(_: string, { arg }: { arg: UploadPhotoFetcherParams }): Promise<ProductPhotoEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const productRepository = new ProductRepositoryImpl(new ProductServiceImpl(new HttpRequest()));

  const session = await sessionRepository.retrieve();
  if (session instanceof DataFailed) throw session.error;
  if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const result = await productRepository.uploadPhoto(arg.productId, arg.file, session.data);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useUploadProductPhoto() {
  return useSWRMutationClerk("upload-product-photo", UploadPhotoFetcher);
}
