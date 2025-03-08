"use client";
import { useEffect, useState } from "react";
import { LocalStorageSessionService } from "@/app/(authentication)/_data/_sources/local-storage-session";
import { SessionRepositoryImpl } from "@/app/(authentication)/_data/_repositories/session";
import { UserServiceImpl } from "@/app/(user)/_data/_data/user";
import { UserRepositoryImpl } from "@/app/(user)/_data/_repositories/user";
import { CheckSessionUseCase } from "@/app/(authentication)/_domain/_usecases/check-session";
import { DataFailed } from "@/core/resources/data-state";
import { useRouter } from "next/navigation";

export function ProtectedPage({ children }: { children: any }) {
  const [loading, setLoading] = useState<boolean>(true);
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

  if (loading) return <></>;
  return (
    <>
      {children}
    </>
  );
}