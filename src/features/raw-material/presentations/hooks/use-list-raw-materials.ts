"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { RawMaterialRepositoryImpl } from "@/features/raw-material/data/repositories/raw-material";
import { RawMaterialServiceImpl } from "@/features/raw-material/data/sources/raw-material";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { ListRawMaterialsParams } from "@/features/raw-material/domain/repositories/raw-material";
import {
  ListRawMaterialsUseCase,
  ListRawMaterialsUseCaseParams,
} from "@/features/raw-material/domain/usecases/list-raw-materials.usecases";
import { RAW_MATERIAL_SWR_KEYS } from "@/features/raw-material/presentations/constants/swr-keys";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  params: ListRawMaterialsParams;
};

async function Fetcher([_, fetcherParams]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fetcherParams.clerk }));
  const rawMaterialRepository = new RawMaterialRepositoryImpl(new RawMaterialServiceImpl(new HttpRequest()));
  const listRawMaterials = new ListRawMaterialsUseCase(rawMaterialRepository, sessionRepository);

  const result = await listRawMaterials.execute(new ListRawMaterialsUseCaseParams(fetcherParams.params));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

type UseListRawMaterialsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

type UseListRawMaterialsReturnType = {
  rawMaterials: RawMaterialEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: ServerError | null;
};

export function useListRawMaterials(params: UseListRawMaterialsParams = {}): UseListRawMaterialsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [RAW_MATERIAL_SWR_KEYS.LIST_RAW_MATERIALS, { clerk, params }],
    Fetcher,
  );

  return {
    rawMaterials: data?.rawMaterials ?? [],
    meta: data?.meta ?? null,
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
