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

interface SelectedAccountContextProps {
  selectedAccount?: PersonalAccountEntity;
  changeAccount?: (account: PersonalAccountEntity) => (void | Promise<void>);
}

const SelectedAccountContext = createContext<SelectedAccountContextProps>({});

export function ProtectedPage({ children }: { children: any }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAccount, setSelectedAccount] = useState<PersonalAccountEntity>();
  const [error, setError] = useState<Error>();
  const router = useRouter();

  useEffect(() => {
    const sessionService = new LocalStorageSessionService();
    const sessionRepository = new SessionRepositoryImpl(sessionService);
    const userService = new UserServiceImpl();
    const userRepository = new UserRepositoryImpl(userService);
    const checkSession = new CheckSessionUseCase(sessionRepository, userRepository);
    checkSession.execute().then((me) => {
      if (me instanceof DataFailed) router.replace("/sign-in");
      else if (!me.data) router.replace("/sign-in");
      else setLoading(false);
    });

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

  if (loading) return <></>;
  return (
    <SelectedAccountContext.Provider value={{ selectedAccount, changeAccount }}>
      {children}
    </SelectedAccountContext.Provider>
  );
}

export function useSelectedAccountProvider() {
  return useContext(SelectedAccountContext);
}