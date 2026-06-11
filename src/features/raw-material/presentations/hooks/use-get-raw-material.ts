"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { RawMaterialRepositoryImpl } from "@/features/raw-material/data/repositories/raw-material";
import { RawMaterialServiceImpl } from "@/features/raw-material/data/sources/raw-material";
import {
  GetRawMaterialUseCase,
  GetRawMaterialUseCaseParams,
} from "@/features/raw-material/domain/usecases/get-raw-material.usecases";
import { RAW_MATERIAL_SWR_KEYS } from "@/features/raw-material/presentations/constants/swr-keys";
import { UseGetRawMaterialReturnType } from "@/features/raw-material/presentations/hooks/use-get-raw-material.types";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  id: string;
};

const INITIAL_STATE: UseGetRawMaterialReturnType = {
  rawMaterial: null,
  loading: true,
  error: null,
};

async function GetRawMaterialFetcher([_, params]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const rawMaterialRepository = new RawMaterialRepositoryImpl(new RawMaterialServiceImpl(new HttpRequest()));
  const useCase = new GetRawMaterialUseCase(rawMaterialRepository, sessionRepository);
  const result = await useCase.execute(new GetRawMaterialUseCaseParams(params.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetRawMaterial(id: string | null): UseGetRawMaterialReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    id ? [RAW_MATERIAL_SWR_KEYS.GET_RAW_MATERIAL, { clerk, id }] : null,
    GetRawMaterialFetcher,
  );

  if (isLoading || !id) return INITIAL_STATE;
  if (error) {
    return {
      rawMaterial: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    rawMaterial: data,
    loading: false,
    error: null,
  };
}
