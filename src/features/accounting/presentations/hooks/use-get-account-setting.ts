"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { AccountSettingRepositoryImpl } from "@/features/accounting/data/repositories/account-setting";
import { AccountSettingServiceImpl } from "@/features/accounting/data/sources/account-setting";
import { GetAccountSettingUseCase } from "@/features/accounting/domain/usecases/get-account-setting.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { GetAccountSettingFetcherParams, UseGetAccountSettingReturnType } from "@/features/accounting/presentations/hooks/use-get-account-setting.types";

const INITIAL_STATE: UseGetAccountSettingReturnType = {
  data: null,
  loading: true,
  error: null,
  refresh: null,
};

async function GetAccountSettingFetcher([_, params]: [string, GetAccountSettingFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new AccountSettingRepositoryImpl(new AccountSettingServiceImpl(new HttpRequest()));
  const uc = new GetAccountSettingUseCase(repo, sessionRepo);
  const result = await uc.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetAccountSetting(): UseGetAccountSettingReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.GET_ACCOUNT_SETTING, { clerk }],
    GetAccountSettingFetcher,
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
