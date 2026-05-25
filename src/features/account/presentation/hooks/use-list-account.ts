"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { ListAccountUseCase } from "@/features/account/domain/usecases/list-account";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import { useMemo } from "react";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import {
  ListAccountFetcherParams,
  UseListAccountReturnType,
} from "@/features/account/presentation/hooks/use-list-account.types";
import { useClerk } from "@clerk/nextjs";

const INITIAL_STATE: UseListAccountReturnType = {
  accounts: null,
  loading: true,
  error: null,
  refresh: null,
};

async function ListAccountFetcher([_, params]: [string, ListAccountFetcherParams]) {
  try {
    const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
    const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));
    const listAccount = new ListAccountUseCase(accountRepository, sessionRepository);
    const accounts = await listAccount.execute();
    if (accounts instanceof DataFailed) throw accounts.error;
    if (accounts.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return accounts.data;
  } catch (err) {
    if (err instanceof ServerError) {
      if (err.code === ErrorCodes.NOT_FOUND.code) return [];
      else throw err;
    } else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
  }
}

export function useListAccount(): UseListAccountReturnType {
  const clerk = useClerk();
  const swrParams = useMemo(() => ({ clerk }), [clerk]);
  const { data, isLoading, error, mutate } = useSWR(["list-account", swrParams], ListAccountFetcher);

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      accounts: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: null,
    };
  }

  return {
    accounts: data ?? [],
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
