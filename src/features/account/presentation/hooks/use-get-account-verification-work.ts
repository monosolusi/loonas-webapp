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
import { HttpRequest } from "@/core/helpers/http-request";
import { AccountVerificationWorkEntity } from "@/features/account/domain/entities/account-verification-work";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useAuth } from "@clerk/nextjs";

type GetAccountVerificationWorkProps = {
  accountId?: string | null;
};

type GetAccountVerificationWorkFetcherParams = GetAccountVerificationWorkProps & {
  getToken: () => Promise<string | null>;
};

async function GetAccountVerificationWorkFetcher([_, params]: [
  string,
  GetAccountVerificationWorkFetcherParams,
]): Promise<AccountVerificationWorkEntity> {
  if (!params.accountId) throw new ServerError(ErrorCodes.NOT_FOUND);

  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ getToken: params.getToken }));
  const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));
  const retrieve = new RetrieveAccountVerificationWorkUseCase(accountRepository, sessionRepository);
  const retrieveParams = new RetrieveAccountVerificationWorkUseCaseParams(params.accountId);

  const accountVerificationWork = await retrieve.execute(retrieveParams);
  if (accountVerificationWork instanceof DataFailed) throw accountVerificationWork.error;
  if (!accountVerificationWork.data) throw new ServerError(ErrorCodes.NOT_FOUND);
  return accountVerificationWork.data;
}

export function useGetAccountVerificationWork(params: GetAccountVerificationWorkProps) {
  const { isLoaded, getToken } = useAuth();
  if (!isLoaded) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

  const shouldFetch = !!params.accountId;
  const { data, isLoading, error, mutate } = useSWR(
    shouldFetch ? ["get-account-verification-work", { ...params, getToken }] : null,
    GetAccountVerificationWorkFetcher,
  );

  return {
    verificationWork: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
