"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CashEntrySettingsRepositoryImpl } from "@/features/accounting/data/repositories/cash-entry-settings";
import { CashEntrySettingsServiceImpl } from "@/features/accounting/data/sources/cash-entry-settings";
import { GetCashEntrySettingsUseCase } from "@/features/accounting/domain/usecases/get-cash-entry-settings.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetCashEntrySettingsFetcherParams,
  UseGetCashEntrySettingsReturnType,
} from "@/features/accounting/presentations/hooks/use-get-cash-entry-settings.types";

const INITIAL_STATE: UseGetCashEntrySettingsReturnType = {
  data: null,
  loading: true,
  error: null,
  refresh: null,
};

async function GetCashEntrySettingsFetcher([_, fp]: [string, GetCashEntrySettingsFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new CashEntrySettingsRepositoryImpl(new CashEntrySettingsServiceImpl(new HttpRequest()));
  const uc = new GetCashEntrySettingsUseCase(repo, sessionRepo);
  const result = await uc.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetCashEntrySettings(): UseGetCashEntrySettingsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.GET_CASH_ENTRY_SETTINGS, { clerk }],
    GetCashEntrySettingsFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: mutate,
    };
  }
  if (!data) return INITIAL_STATE;

  return { data, loading: false, error: null, refresh: mutate };
}
