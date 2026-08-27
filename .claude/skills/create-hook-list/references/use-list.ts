// Canonical example: SWR-backed list hook with discriminated-union state.
// Source: src/features/production/presentations/hooks/use-list-production-records.ts

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
  ListProductionRecordsUseCase,
  ListProductionRecordsUseCaseParams,
} from "@/features/production/domain/usecases/list-production-records.usecases";
import { PRODUCTION_SWR_KEYS } from "@/features/production/presentations/constants/swr-keys";
import {
  ListProductionRecordFetcherParams,
  UseListProductionRecordsParams,
  UseListProductionRecordsReturnType,
} from "@/features/production/presentations/hooks/use-list-production-records.types";

async function ListProductionRecordFetcher([_, params]: [string, ListProductionRecordFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const productionRecordRepository = new ProductionRecordRepositoryImpl(
    new ProductionRecordServiceImpl(new HttpRequest()),
  );
  const useCase = new ListProductionRecordsUseCase(productionRecordRepository, sessionRepository);
  const result = await useCase.execute(
    new ListProductionRecordsUseCaseParams({
      search: params.search,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      productId: params.productId,
      page: params.page,
      limit: params.limit,
    }),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListProductionRecords(
  params: UseListProductionRecordsParams = {},
): UseListProductionRecordsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [PRODUCTION_SWR_KEYS.LIST_PRODUCTION_RECORDS, { ...params, clerk }],
    ListProductionRecordFetcher,
  );

  // Built per render, not as a module constant: it must carry this render's `mutate`.
  // The explicit annotation is load-bearing — without it TS infers `loading: boolean`.
  const initialState: UseListProductionRecordsReturnType = {
    records: null,
    meta: null,
    loading: true,
    error: null,
    refresh: mutate,
  };

  if (isLoading) return initialState;
  if (error) {
    return {
      records: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: mutate,
    };
  }

  if (!data) return initialState;

  return {
    records: data.data,
    meta: data.meta,
    loading: false,
    error: null,
    refresh: mutate,
  };
}
