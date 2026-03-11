"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { ListAccountUseCase } from "@/features/account/domain/usecases/list-account";
import {
  RetrieveAccountVerificationWorkUseCase,
  RetrieveAccountVerificationWorkUseCaseParams,
} from "@/features/account/domain/usecases/retrieve-account-verification-work";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { UseListApprovedAccountsReturnType } from "@/features/account/presentation/hooks/use-list-approved-accounts.types";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};

async function listApprovedAccountsFetcher([_, params]: [string, FetcherParams]): Promise<AccountTypeEntity[]> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));

  const listUseCase = new ListAccountUseCase(accountRepository, sessionRepository);
  const accountsResult = await listUseCase.execute();

  if (accountsResult instanceof DataFailed) throw accountsResult.error;
  if (!accountsResult.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const verifyUseCase = new RetrieveAccountVerificationWorkUseCase(accountRepository, sessionRepository);

  const verificationResults = await Promise.allSettled(
    accountsResult.data.map((account) => verifyUseCase.execute(new RetrieveAccountVerificationWorkUseCaseParams(account.id))),
  );

  return accountsResult.data.filter((_, index) => {
    const result = verificationResults[index];
    if (result.status !== "fulfilled") return false;

    const verificationWork = result.value;
    if (verificationWork instanceof DataFailed) return false;
    if (!verificationWork.data) return false;

    return (
      verificationWork.data.latestStatus === VerificationStatus.COMPLETED &&
      verificationWork.data.verificationOutcome === VerificationOutcome.APPROVED
    );
  });
}

const INITIAL_STATE: UseListApprovedAccountsReturnType = {
  accounts: null,
  loading: true,
  error: null,
};

export function useListApprovedAccounts(): UseListApprovedAccountsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-approved-accounts", { clerk }], listApprovedAccountsFetcher);

  if (isLoading) return INITIAL_STATE;
  if (error) {
    if (error instanceof ServerError && error.code === ErrorCodes.NOT_FOUND.code) {
      return { accounts: [], loading: false, error: null };
    }
    return {
      accounts: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  return {
    accounts: data ?? [],
    loading: false,
    error: null,
  };
}
