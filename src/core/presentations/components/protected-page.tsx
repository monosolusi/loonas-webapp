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
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { UserSignOutUseCase } from "@/features/authentication/domain/usecases/user-sign-out";

export function ProtectedPage({ children }: { children: any }) {
  const [sessionLoading, setSessionLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      if (error instanceof ServerError) {
        // Force sign out
        const sessionService = new LocalStorageSessionService();
        const sessionRepository = new SessionRepositoryImpl(sessionService);
        const signOut = new UserSignOutUseCase(sessionRepository);
        signOut
          .execute()
          .then(() => router.replace("/sign-in"))
          .catch((err) => setError(err));
      } else throw error;
    }
  }, [error]);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      setSessionLoading(true);

      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const userService = new UserServiceImpl();
      const userRepository = new UserRepositoryImpl(userService);
      const checkSession = new CheckSessionUseCase(sessionRepository, userRepository);
      const me = await checkSession.execute();
      if (me instanceof DataFailed) throw me.error;
      if (!me.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setSessionLoading(false);
    } catch (err: any) {
      setError(err);
    }
  }

  if (sessionLoading) return <></>;
  return (
    <SelectedAccountProvider>
      {children}
    </SelectedAccountProvider>
  );
}