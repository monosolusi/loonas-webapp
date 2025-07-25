import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import {
  RetrieveAccountVerificationWorkUseCase,
  RetrieveAccountVerificationWorkUseCaseParams,
} from "@/features/account/domain/usecases/retrieve-account-verification-work";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";

interface GetAccountVerificationWorkFetcherParams {
  accountId?: string;
}

async function GetAccountVerificationWorkFetcher([_, params]: [string, GetAccountVerificationWorkFetcherParams]) {
  if (!params.accountId) throw new ServerError(ErrorCodes.NOT_FOUND);

  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const accountService = new AccountServiceImpl();
  const accountRepository = new AccountRepositoryImpl(accountService);
  const retrieve = new RetrieveAccountVerificationWorkUseCase(accountRepository, sessionRepository);
  const retrieveParams = new RetrieveAccountVerificationWorkUseCaseParams(params.accountId);

  const accountVerificationWork = await retrieve.execute(retrieveParams);
  if (accountVerificationWork instanceof DataFailed) throw accountVerificationWork.error;
  if (!accountVerificationWork.data) throw new ServerError(ErrorCodes.NOT_FOUND);
  return accountVerificationWork.data;
}

export function useGetAccountVerificationWork(params: GetAccountVerificationWorkFetcherParams) {
  const { data, isLoading, error, mutate } = useSWR(
    ["get-account-verification-work", params],
    GetAccountVerificationWorkFetcher,
  );

  return {
    verificationWork: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
