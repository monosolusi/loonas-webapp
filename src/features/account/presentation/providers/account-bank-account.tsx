"use client";

import React, { useEffect, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { DataFailed } from "@/core/resources/data-state";
import { AccountBankAccountEntity } from "@/features/account/domain/entities/account-bank-account";
import { ListAccountBankAccountUseCase } from "@/features/account/domain/usecases/list-account-bank-account";

interface AccountBankAccountProviderProps {
  children: React.ReactNode;
}

interface AccountBankAccountContextProps {
  bankAccounts?: AccountBankAccountEntity[];
  loading: boolean;
  error?: ServerError;
}

const AccountBankAccountContext = React.createContext<AccountBankAccountContextProps>({
  loading: true
});

export function AccountBankAccountProvider(props: AccountBankAccountProviderProps) {
  const [bankAccounts, setBankAccounts] = useState<AccountBankAccountEntity[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ServerError>();

  const listAccountBankAccount = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const accountService = new AccountServiceImpl();
      const accountRepository = new AccountRepositoryImpl(accountService);
      const retrieve = new ListAccountBankAccountUseCase(accountRepository, sessionRepository);
      const accountBankAccount = await retrieve.execute();
      if (accountBankAccount instanceof DataFailed) throw accountBankAccount.error;
      if (!accountBankAccount.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      setBankAccounts(accountBankAccount.data);
      setLoading(false);
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      else setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  };

  useEffect(() => {
    listAccountBankAccount();
  }, []);

  return (
    <AccountBankAccountContext.Provider
      value={{ bankAccounts, loading, error }}
    >
      {props.children}
    </AccountBankAccountContext.Provider>
  );
}

export function useAccountBankAccount() {
  return React.useContext(AccountBankAccountContext);
}
