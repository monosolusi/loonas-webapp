"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelectedAccountProvider } from "@/app/(authentication)/_presentation/_components/protected-page";
import { LocalStorageSessionService } from "@/app/(authentication)/_data/_sources/local-storage-session";
import { SessionRepositoryImpl } from "@/app/(authentication)/_data/_repositories/session";
import { AccountServiceImpl } from "@/app/(account)/_data/_sources/account";
import { AccountRepositoryImpl } from "@/app/(account)/_data/_repositories/account";
import { ListAccountUseCase } from "@/app/(account)/_domain/_usecases/list-account";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export default function CreateInvoicePage() {
  const router = useRouter();
  const { selectedAccount } = useSelectedAccountProvider();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) {
      if (error instanceof ServerError) {
        if (error.code === ErrorCodes.NOT_FOUND.code) router.replace("/invoices/no-account");
        else if (error.code == ErrorCodes.ACCOUNT_NOT_VERIFIED.code) {
          if (!selectedAccount) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
          router.replace(`/invoices/account-not-verified`);
        } else throw error;
      } else throw error;
    }
  }, [error]);


  useEffect(() => {
    setLoading(true);
    checkIfUserHasAccount()
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedAccount) return;
    setLoading(true);
    checkIfASelectedAccountIsVerified()
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [selectedAccount]);

  async function checkIfUserHasAccount() {
    const sessionService = new LocalStorageSessionService();
    const sessionRepository = new SessionRepositoryImpl(sessionService);
    const accountService = new AccountServiceImpl();
    const accountRepository = new AccountRepositoryImpl(accountService);
    const listAccount = new ListAccountUseCase(accountRepository, sessionRepository);
    const accounts = await listAccount.execute();
    if (accounts instanceof DataFailed) throw accounts.error;
    if (accounts.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    if (accounts.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);
    return true;
  }

  async function checkIfASelectedAccountIsVerified() {
    throw new ServerError(ErrorCodes.ACCOUNT_NOT_VERIFIED);
  }

  return (
    <>Loading...</>
  );
}