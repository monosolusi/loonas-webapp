"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LocalStorageSessionService } from "@/app/(authentication)/_data/_sources/local-storage-session";
import { AccountRepositoryImpl } from "@/app/(account)/_data/_repositories/account";
import { AccountServiceImpl } from "@/app/(account)/_data/_sources/account";
import { SessionRepositoryImpl } from "@/app/(authentication)/_data/_repositories/session";
import { AccountVerificationWorkEntity } from "@/app/(account)/_domain/_entities/account-verification-work";
import {
  RetrieveAccountVerificationWorkUseCase,
  RetrieveAccountVerificationWorkUseCaseParams
} from "@/app/(account)/_domain/_usecases/retrieve-account-verification-work";
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