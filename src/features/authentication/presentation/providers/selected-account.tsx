"use client";

import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { RetrieveSessionAccountUseCase } from "@/features/authentication/domain/usecases/retrieve-session-account";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  SelectSessionAccountUseCase,
  SelectSessionAccountUseCaseParams
} from "@/features/authentication/domain/usecases/select-session-account";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { createContext, useContext, useEffect, useState } from "react";

interface SelectedAccountContextProps {
  states: [boolean]; // loading
  selectedAccount?: PersonalAccountEntity;
  changeAccount?: (account: PersonalAccountEntity) => (void | Promise<void>);
}

const SelectedAccountContext = createContext<SelectedAccountContextProps>({
  states: [true]
});

export function SelectedAccountProvider({ children }: { children: any }) {
  const [selectedAccount, setSelectedAccount] = useState<PersonalAccountEntity>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    setLoading(true);

    const sessionService = new LocalStorageSessionService();
    const sessionRepository = new SessionRepositoryImpl(sessionService);
    const retrieveAccount = new RetrieveSessionAccountUseCase(sessionRepository);
    retrieveAccount
      .execute()
      .then((account) => {
        if (account instanceof DataFailed) throw account.error;
        if (!account.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
        setSelectedAccount(account.data);
      })
      .catch((err: any) => {
        // Ignore if the account is not found
        if (err instanceof ServerError && err.code === ErrorCodes.NOT_FOUND.code) return;
        else setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * This function will do dumb select only and will not check the account ownership.
   * However, the backend will be able to check the account ownership.
   * It Should be a good thing for a moment until we release the MVP.
   * @param newAccount
   */
  async function changeAccount(newAccount: PersonalAccountEntity) {
    try {
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const selectAccount = new SelectSessionAccountUseCase(sessionRepository);
      const selectAccountParams = new SelectSessionAccountUseCaseParams(newAccount);
      const selectedAccount = await selectAccount.execute(selectAccountParams);
      if (selectedAccount instanceof DataFailed) throw selectedAccount.error;
      if (!selectedAccount.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      setSelectedAccount(selectedAccount.data);
    } catch (err: any) {
      setError(err);
    }
  }

  return (
    <SelectedAccountContext.Provider
      value={{ selectedAccount, changeAccount, states: [loading] }}
    >
      {children}
    </SelectedAccountContext.Provider>
  );
}

export function useSelectedAccountProvider() {
  return useContext(SelectedAccountContext);
}