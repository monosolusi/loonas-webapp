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
import { MembershipStatus } from "@/features/account/domain/enums/membership-status";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { UseListApprovedAccountsReturnType } from "@/features/account/presentation/hooks/use-list-approved-accounts.types";
import { ACCOUNT_SWR_KEYS } from "@/features/account/presentation/constants/swr-keys";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};

async function ListApprovedAccountFetcher([_, params]: [string, FetcherParams]): Promise<AccountTypeEntity[]> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));

  const listUseCase = new ListAccountUseCase(accountRepository, sessionRepository);
  const accountsResult = await listUseCase.execute();

  if (accountsResult instanceof DataFailed) throw accountsResult.error;
  if (!accountsResult.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  // The switcher only lists accounts the user can switch into and operate. Status is read from each
  // account's own verification fields (the same per-account data the /accounts badge uses) — never
  // from the current session's verification, which would taint every row with the active account's status.
  return accountsResult.data.filter((account) => {
    // Exclude accounts with pending membership (not yet accepted invites)
    if (account.membership && account.membership.status === MembershipStatus.PENDING) return false;

    return account.isApproved;
  });
}

const INITIAL_STATE: UseListApprovedAccountsReturnType = {
  accounts: null,
  loading: true,
  error: null,
};

export function useListApprovedAccounts(): UseListApprovedAccountsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR([ACCOUNT_SWR_KEYS.LIST_APPROVED_ACCOUNTS, { clerk }], ListApprovedAccountFetcher);

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
