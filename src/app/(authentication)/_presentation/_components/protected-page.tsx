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

interface SelectedAccountContextProps {
  selectedAccount?: PersonalAccountEntity;
  changeAccount?: (account: PersonalAccountEntity) => (void | Promise<void>);
}

const SelectedAccountContext = createContext<SelectedAccountContextProps>({});

export function ProtectedPage({ children }: { children: any }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAccount, setSelectedAccount] = useState<PersonalAccountEntity>();
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
  function changeAccount(newAccount: PersonalAccountEntity) {
    setSelectedAccount(newAccount);
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