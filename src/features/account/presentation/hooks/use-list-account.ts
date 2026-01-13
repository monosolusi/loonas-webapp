"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { ListAccountUseCase } from "@/features/account/domain/usecases/list-account";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ListAccountFetcherParams } from "@/features/account/presentation/hooks/use-list-account.types";
import { useAuth } from "@clerk/nextjs";

async function ListAccountFetcher([_, params]: [string, ListAccountFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ getToken: params.getToken }));
  const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));
  const listAccount = new ListAccountUseCase(accountRepository, sessionRepository);
  const accounts = await listAccount.execute();
  if (accounts instanceof DataFailed) throw accounts.error;
  if (accounts.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (accounts.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);

  return accounts.data;
}

export function useListAccount() {
  const { isLoaded, getToken } = useAuth();
  if (!isLoaded) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

  const { data, isLoading, error, mutate } = useSWR(["list-account", { getToken }], ListAccountFetcher);

  return {
    accounts: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
