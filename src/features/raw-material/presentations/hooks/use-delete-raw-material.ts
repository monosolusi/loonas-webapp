"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { RawMaterialRepositoryImpl } from "@/features/raw-material/data/repositories/raw-material";
import { RawMaterialServiceImpl } from "@/features/raw-material/data/sources/raw-material";
import {
  DeleteRawMaterialUseCase,
  DeleteRawMaterialUseCaseParams,
} from "@/features/raw-material/domain/usecases/delete-raw-material.usecases";
import { useClerk } from "@clerk/nextjs";

type DeleteRawMaterialTriggerParams = { id: string };

type DeleteRawMaterialFetcherParams = DeleteRawMaterialTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function DeleteRawMaterialFetcher(
  _: string,
  { arg }: { arg: DeleteRawMaterialFetcherParams },
): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const rawMaterialRepository = new RawMaterialRepositoryImpl(new RawMaterialServiceImpl(new HttpRequest()));
  const deleteRawMaterial = new DeleteRawMaterialUseCase(rawMaterialRepository, sessionRepository);

  const result = await deleteRawMaterial.execute(new DeleteRawMaterialUseCaseParams(arg.id));
  if (result instanceof DataFailed) throw result.error;
}

export function useDeleteRawMaterial() {
  return useSWRMutationClerk("delete-raw-material", DeleteRawMaterialFetcher);
}
