"use client";

// entity, loading
import React, { createContext, useContext, useEffect, useState } from "react";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { ListAccountUseCase } from "@/features/account/domain/usecases/list-account";
import { HttpRequest } from "@/core/helpers/http-request";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

type AccountListContextProps = [AccountTypeEntity[] | undefined, boolean];
const AccountListContext = createContext<AccountListContextProps>([[], true]);

/**
 * @deprecated
 */
export function AccountListProvider({ children }: { children: any }) {
  const [accounts, setAccounts] = useState<AccountTypeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) {
      // Ignore the NOT_FOUND error, set the accounts to an empty array instead
      if (error instanceof ServerError && error.code === ErrorCodes.NOT_FOUND.code) setAccounts([]);
      else throw error;
    }
  }, [error]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const http = new HttpRequest();
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const accountService = new AccountServiceImpl(http);
      const accountRepository = new AccountRepositoryImpl(accountService);
      const listAccount = new ListAccountUseCase(accountRepository, sessionRepository);
      const accounts = await listAccount.execute();
      if (accounts instanceof DataFailed) throw accounts.error;
      if (accounts.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (accounts.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);

      setAccounts(accounts.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return <AccountListContext.Provider value={[accounts, loading]}>{children}</AccountListContext.Provider>;
}

export function useAccountListProvider() {
  return useContext(AccountListContext);
}
