"use client";

import React, { useEffect, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { ListAccountUseCase } from "@/features/account/domain/usecases/list-account";
import { DataFailed } from "@/core/resources/data-state";
import { useRouter } from "next/navigation";
import { HttpRequest } from "@/core/helpers/http-request";

export function MustHaveAccount(props: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();
  const router = useRouter();

  const checkIfUserHasAccount = async () => {
    const sessionService = new LocalStorageSessionService();
    const sessionRepository = new SessionRepositoryImpl(sessionService);
    const http = new HttpRequest();
    const accountService = new AccountServiceImpl(http);
    const accountRepository = new AccountRepositoryImpl(accountService);
    const listAccount = new ListAccountUseCase(accountRepository, sessionRepository);
    const accounts = await listAccount.execute();
    if (accounts instanceof DataFailed) throw accounts.error;
    if (accounts.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    if (accounts.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);
    return true;
  };

  useEffect(() => {
    if (!error) return;
    if (error instanceof ServerError) {
      if (error.code === ErrorCodes.NOT_FOUND.code) router.replace("/invoices/no-account");
      else throw error;
    } else throw error;
  }, [error]);

  useEffect(() => {
    setLoading(true);
    checkIfUserHasAccount()
      .then(() => setLoading(false))
      .catch((err) => setError(err));
  }, []);

  if (loading || error) return null;
  return <>{props.children}</>;
}
