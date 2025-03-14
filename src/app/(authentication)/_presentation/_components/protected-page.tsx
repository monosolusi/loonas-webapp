/**
 * These component also serves as session manager. It means, it will manage the token, and also manage the selected account
 * I might be wrong, and not a best practice, but we will keep it here first before we decide to change it later.
 */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LocalStorageSessionService } from "@/app/(authentication)/_data/_sources/local-storage-session";
import { SessionRepositoryImpl } from "@/app/(authentication)/_data/_repositories/session";
import { UserServiceImpl } from "@/app/(user)/_data/_sources/user";
import { UserRepositoryImpl } from "@/app/(user)/_data/_repositories/user";
import { CheckSessionUseCase } from "@/app/(authentication)/_domain/_usecases/check-session";
import { DataFailed } from "@/core/resources/data-state";
import { useRouter } from "next/navigation";
import { PersonalAccountEntity } from "@/app/(account)/_domain/_entities/personal-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  SelectSessionAccountUseCase,
  SelectSessionAccountUseCaseParams
} from "../../_domain/_usecases/select-session-account";
import { RetrieveSessionAccountUseCase } from "../../_domain/_usecases/retrieve-session-account";

interface SelectedAccountContextProps {
  states: [boolean, boolean]; // selectLoading, sessionLoading
  selectedAccount?: PersonalAccountEntity;
  changeAccount?: (account: PersonalAccountEntity) => (void | Promise<void>);
}

const SelectedAccountContext = createContext<SelectedAccountContextProps>({
  states: [true, true]
});

export function ProtectedPage({ children }: { children: any }) {
  const [sessionLoading, setSessionLoading] = useState<boolean>(true);
  const [selectLoading, setSelectLoading] = useState<boolean>(true);
  const [selectedAccount, setSelectedAccount] = useState<PersonalAccountEntity>();
  const [error, setError] = useState<Error>();
  const router = useRouter();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const sessionService = new LocalStorageSessionService();
    const sessionRepository = new SessionRepositoryImpl(sessionService);

    setSelectLoading(true);
    setSessionLoading(true);

    // Also, retrieve the session account if any
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
      .finally(() => setSelectLoading(false));


    const userService = new UserServiceImpl();
    const userRepository = new UserRepositoryImpl(userService);
    const checkSession = new CheckSessionUseCase(sessionRepository, userRepository);
    checkSession.execute().then((me) => {
      if (me instanceof DataFailed) router.replace("/sign-in");
      else if (!me.data) router.replace("/sign-in");
    }).finally(() => setSessionLoading(false));
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

  if (sessionLoading) return <></>;
  return (
    <SelectedAccountContext.Provider
      value={{ selectedAccount, changeAccount, states: [selectLoading, sessionLoading] }}>
      {children}
    </SelectedAccountContext.Provider>
  );
}

export function useSelectedAccountProvider() {
  return useContext(SelectedAccountContext);
}