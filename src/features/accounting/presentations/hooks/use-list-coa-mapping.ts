"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CoaMappingRepositoryImpl } from "@/features/accounting/data/repositories/coa-mapping";
import { CoaMappingServiceImpl } from "@/features/accounting/data/sources/coa-mapping";
import { ListCoaMappingsUseCase, ListCoaMappingsUseCaseParams } from "@/features/accounting/domain/usecases/list-coa-mappings.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListCoaMappingFetcherParams,
  UseListCoaMappingParams,
  UseListCoaMappingReturnType,
} from "@/features/accounting/presentations/hooks/use-list-coa-mapping.types";

const INITIAL_STATE: UseListCoaMappingReturnType = {
  mappings: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListCoaMappingFetcher([_, params]: [string, ListCoaMappingFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new CoaMappingRepositoryImpl(new CoaMappingServiceImpl(new HttpRequest()));
  const uc = new ListCoaMappingsUseCase(repo, sessionRepo);
  const result = await uc.execute(
    new ListCoaMappingsUseCaseParams({
      page: params.page,
      limit: params.limit,
      entityType: params.entityType,
    }),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListCoaMapping(params: UseListCoaMappingParams = {}): UseListCoaMappingReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [ACCOUNTING_SWR_KEYS.LIST_COA_MAPPINGS, { ...params, clerk }],
    ListCoaMappingFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      mappings: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    mappings: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
