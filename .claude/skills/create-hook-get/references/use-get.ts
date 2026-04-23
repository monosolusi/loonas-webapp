// Canonical example: SWR-backed get-by-id hook.
// Source: src/features/production/presentations/hooks/use-get-production-record.ts

"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ProductionRecordRepositoryImpl } from "@/features/production/data/repositories/production-record";
import { ProductionRecordServiceImpl } from "@/features/production/data/sources/production-record";
import {
  GetProductionRecordUseCase,
  GetProductionRecordUseCaseParams,
} from "@/features/production/domain/usecases/get-production-record.usecases";
import { PRODUCTION_SWR_KEYS } from "@/features/production/presentations/constants/swr-keys";
import { UseGetProductionRecordReturnType } from "@/features/production/presentations/hooks/use-get-production-record.types";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  id: string;
};

const INITIAL_STATE: UseGetProductionRecordReturnType = {
  record: null,
  loading: true,
  error: null,
};

async function GetProductionRecordFetcher([_, params]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const productionRecordRepository = new ProductionRecordRepositoryImpl(
    new ProductionRecordServiceImpl(new HttpRequest()),
  );
  const useCase = new GetProductionRecordUseCase(productionRecordRepository, sessionRepository);
  const result = await useCase.execute(new GetProductionRecordUseCaseParams(params.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetProductionRecord(id: string | null): UseGetProductionRecordReturnType {
  const clerk = useClerk();
  // SWR key is null when id is missing → fetch is skipped.
  const { data, isLoading, error } = useSWR(
    id ? [PRODUCTION_SWR_KEYS.GET_PRODUCTION_RECORD, { clerk, id }] : null,
    GetProductionRecordFetcher,
  );

  if (isLoading || !id) return INITIAL_STATE;
  if (error) {
    return {
      record: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    record: data,
    loading: false,
    error: null,
  };
}
