"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { ListAccountUseCase } from "@/features/account/domain/usecases/list-account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import {
  RetrieveAccountVerificationWorkUseCase,
  RetrieveAccountVerificationWorkUseCaseParams
} from "@/features/account/domain/usecases/retrieve-account-verification-work";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";

export default function CreateInvoiceLayout({ children }: { children: any }) {
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
    if (!selectedAccount) throw new ServerError(ErrorCodes.NOT_FOUND);
    const sessionService = new LocalStorageSessionService();
    const sessionRepository = new SessionRepositoryImpl(sessionService);
    const accountService = new AccountServiceImpl();
    const accountRepository = new AccountRepositoryImpl(accountService);
    const retrieve = new RetrieveAccountVerificationWorkUseCase(accountRepository, sessionRepository);
    const retrieveParams = new RetrieveAccountVerificationWorkUseCaseParams(selectedAccount.id);
    const verificationWork = await retrieve.execute(retrieveParams);
    if (verificationWork instanceof DataFailed) throw verificationWork.error;
    if (!verificationWork.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    if (verificationWork.data.latestStatus !== VerificationStatus.COMPLETED) throw new ServerError(ErrorCodes.ACCOUNT_NOT_VERIFIED);
  }

  return (
    <>
      {children}
    </>
  );
}