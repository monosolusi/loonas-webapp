"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { RawMaterialRepositoryImpl } from "@/features/raw-material/data/repositories/raw-material";
import { RawMaterialServiceImpl } from "@/features/raw-material/data/sources/raw-material";
import {
  CreateRawMaterialUseCase,
  CreateRawMaterialUseCaseParams,
} from "@/features/raw-material/domain/usecases/create-raw-material.usecases";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { useClerk } from "@clerk/nextjs";

type CreateRawMaterialTriggerParams = { name: string; unit: string };

type CreateRawMaterialFetcherParams = CreateRawMaterialTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function CreateRawMaterialFetcher(
  _: string,
  { arg }: { arg: CreateRawMaterialFetcherParams },
): Promise<RawMaterialEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const rawMaterialRepository = new RawMaterialRepositoryImpl(new RawMaterialServiceImpl(new HttpRequest()));
  const createRawMaterial = new CreateRawMaterialUseCase(rawMaterialRepository, sessionRepository);

  const result = await createRawMaterial.execute(new CreateRawMaterialUseCaseParams({ name: arg.name, unit: arg.unit }));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useCreateRawMaterial() {
  return useSWRMutationClerk("create-raw-material", CreateRawMaterialFetcher);
}
