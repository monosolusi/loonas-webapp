"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CoaMappingEntityTypeRepositoryImpl } from "@/features/accounting/data/repositories/coa-mapping-entity-type";
import { CoaMappingEntityTypeServiceImpl } from "@/features/accounting/data/sources/coa-mapping-entity-type";
import { ListCoaMappingEntityTypesUseCase } from "@/features/accounting/domain/usecases/list-coa-mapping-entity-types.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListCoaMappingEntityTypeFetcherParams,
  UseListCoaMappingEntityTypeReturnType,
} from "@/features/accounting/presentations/hooks/use-list-coa-mapping-entity-type.types";

const INITIAL_STATE: UseListCoaMappingEntityTypeReturnType = {
  entityTypes: null,
  loading: true,
  error: null,
};

async function ListCoaMappingEntityTypeFetcher([_, params]: [string, ListCoaMappingEntityTypeFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new CoaMappingEntityTypeRepositoryImpl(new CoaMappingEntityTypeServiceImpl(new HttpRequest()));
  const uc = new ListCoaMappingEntityTypesUseCase(repo, sessionRepo);
  const result = await uc.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListCoaMappingEntityType(): UseListCoaMappingEntityTypeReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [ACCOUNTING_SWR_KEYS.LIST_COA_MAPPING_ENTITY_TYPES, { clerk }],
    ListCoaMappingEntityTypeFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      entityTypes: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    entityTypes: data,
    loading: false,
    error: null,
  };
}
