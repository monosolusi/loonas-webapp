"use client";

import { useEffect, useState } from "react";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import {
  RetrieveAccountVerificationWorkUseCase,
  RetrieveAccountVerificationWorkUseCaseParams,
} from "@/features/account/domain/usecases/retrieve-account-verification-work";
import { DataFailed } from "@/core/resources/data-state";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { useRouter } from "next/navigation";

export function MustVerifiedAccount(props: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();
  const { selectedAccount } = useSelectedAccountProvider();
  const router = useRouter();

  const checkIfSelectedAccountIsVerified = async () => {
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
    if (verificationWork.data.latestStatus !== VerificationStatus.COMPLETED) {
      throw new ServerError(ErrorCodes.ACCOUNT_NOT_VERIFIED);
    }
  };

  useEffect(() => {
    if (!selectedAccount) return;
    setLoading(true);
    checkIfSelectedAccountIsVerified()
      .then(() => setLoading(false))
      .catch((err) => setError(err));
  }, [selectedAccount]);

  useEffect(() => {
    if (!error) return;
    if (error instanceof ServerError) {
      if (error.code === ErrorCodes.ACCOUNT_NOT_VERIFIED.code) {
        router.replace(`/invoices/account-not-verified`);
      } else if (error.code === ErrorCodes.NOT_FOUND.code) router.replace("invoices/no-account");
    } else throw error;
  }, [error]);

  if (loading) return null;
  return <>{props.children}</>;
}
