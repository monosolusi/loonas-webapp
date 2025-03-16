"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AccountVerificationWorkEntity } from "../../domain/entities/account-verification-work";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "../../data/sources/account";
import { AccountRepositoryImpl } from "../../data/repositories/account";
import {
  RetrieveAccountVerificationWorkUseCase,
  RetrieveAccountVerificationWorkUseCaseParams
} from "../../domain/usecases/retrieve-account-verification-work";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

// entity, loading
type AccountVerificationWorkContextProps = [AccountVerificationWorkEntity | undefined, boolean];
const AccountVerificationWorkContext = createContext<AccountVerificationWorkContextProps>([undefined, true]);

export function AccountVerificationWorkProvider({ children, id }: { children: any, id: string }) {
  const [accountVerificationWork, setAccountVerificationWork] = useState<AccountVerificationWorkEntity>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const accountService = new AccountServiceImpl();
      const accountRepository = new AccountRepositoryImpl(accountService);
      const retrieve = new RetrieveAccountVerificationWorkUseCase(accountRepository, sessionRepository);
      const retrieveParams = new RetrieveAccountVerificationWorkUseCaseParams(id);
      const accountVerificationWork = await retrieve.execute(retrieveParams);
      if (accountVerificationWork instanceof DataFailed) throw accountVerificationWork.error;
      if (!accountVerificationWork.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setAccountVerificationWork(accountVerificationWork.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AccountVerificationWorkContext.Provider
      value={[accountVerificationWork, loading]}
    >
      {children}
    </AccountVerificationWorkContext.Provider>
  );
}

export function useAccountVerificationWork() {
  return useContext(AccountVerificationWorkContext);
}