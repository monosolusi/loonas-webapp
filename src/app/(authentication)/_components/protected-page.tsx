"use client";

import { useEffect, useState } from "react";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { UserServiceImpl } from "@/features/user/data/sources/user";
import { UserRepositoryImpl } from "@/features/user/data/repositories/user";
import { CheckSessionUseCase } from "@/features/authentication/domain/usecases/check-session";
import { DataFailed } from "@/core/resources/data-state";
import { useRouter } from "next/navigation";
import { SelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";

export function ProtectedPage({ children }: { children: any }) {
  const [sessionLoading, setSessionLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    setSessionLoading(true);

    const sessionService = new LocalStorageSessionService();
    const sessionRepository = new SessionRepositoryImpl(sessionService);
    const userService = new UserServiceImpl();
    const userRepository = new UserRepositoryImpl(userService);
    const checkSession = new CheckSessionUseCase(sessionRepository, userRepository);
    checkSession.execute().then((me) => {
      if (me instanceof DataFailed) router.replace("/sign-in");
      else if (!me.data) router.replace("/sign-in");
    }).finally(() => setSessionLoading(false));
  }, []);

  if (sessionLoading) return <></>;
  return (
    <SelectedAccountProvider>
      {children}
    </SelectedAccountProvider>
  );
}