"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { AccountSettingAuditRepositoryImpl } from "@/features/accounting/data/repositories/account-setting-audit";
import { AccountSettingAuditServiceImpl } from "@/features/accounting/data/sources/account-setting-audit";
import { ListAccountSettingAuditUseCase, ListAccountSettingAuditUseCaseParams } from "@/features/accounting/domain/usecases/list-account-setting-audit.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListAccountSettingAuditFetcherParams,
  UseListAccountSettingAuditParams,
  UseListAccountSettingAuditReturnType,
} from "@/features/accounting/presentations/hooks/use-list-account-setting-audit.types";

const INITIAL_STATE: UseListAccountSettingAuditReturnType = {
  data: null,
  loading: true,
  error: null,
  refresh: null,
};

async function ListAccountSettingAuditFetcher([_, params]: [string, ListAccountSettingAuditFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new AccountSettingAuditRepositoryImpl(new AccountSettingAuditServiceImpl(new HttpRequest()));
  const uc = new ListAccountSettingAuditUseCase(repo, sessionRepo);
  const result = await uc.execute(new ListAccountSettingAuditUseCaseParams(params.page, params.limit));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListAccountSettingAudit(
  params: UseListAccountSettingAuditParams = {},
): UseListAccountSettingAuditReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.LIST_ACCOUNT_SETTING_AUDIT, { ...params, clerk }],
    ListAccountSettingAuditFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: null,
    };
  }
  if (!data) return INITIAL_STATE;

  return {
    data,
    loading: false,
    error: null,
    refresh: mutate,
  };
}
