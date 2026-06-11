"use client";

import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { ListAccountBankAccountUseCase } from "@/features/account/domain/usecases/list-account-bank-account";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import { useMemo } from "react";
import { HttpRequest } from "@/core/helpers/http-request";

async function listAccountBankAccountFetcher([_, params]: [string, { clerk: ReturnType<typeof useClerk> }]) {
  const sessionService = new ClerkSessionService({ clerk: params.clerk });
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const http = new HttpRequest();
  const accountService = new AccountServiceImpl(http);
  const accountRepository = new AccountRepositoryImpl(accountService);
  const retrieve = new ListAccountBankAccountUseCase(accountRepository, sessionRepository);
  const accountBankAccount = await retrieve.execute();
  if (accountBankAccount instanceof DataFailed) throw accountBankAccount.error;
  if (!accountBankAccount.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return accountBankAccount.data;
}

export function useListAccountBankAccout() {
  const clerk = useClerk();
  const swrParams = useMemo(() => ({ clerk }), [clerk]);
  const { data, error, isLoading } = useSWR(["list-account-bank-account", swrParams], listAccountBankAccountFetcher);
  return {
    bankAccounts: data ?? [],
    loading: isLoading,
    error: error,
  };
}
