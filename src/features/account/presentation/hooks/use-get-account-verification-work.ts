import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { RetrieveAccountVerificationWorkUseCase } from "@/features/account/domain/usecases/retrieve-account-verification-work";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import { HttpRequest } from "@/core/helpers/http-request";
import { AccountVerificationWorkEntity } from "@/features/account/domain/entities/account-verification-work";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useClerk } from "@clerk/nextjs";
import {
  GetAccountVerificationWorkFetcherParams,
  GetAccountVerificationWorkProps,
  UseGetAccountVerificationWorkReturnType,
} from "@/features/account/presentation/hooks/use-get-account-verification-work.types";
import { ACCOUNT_SWR_KEYS } from "@/features/account/presentation/constants/swr-keys";

const INITIAL_STATE: UseGetAccountVerificationWorkReturnType = {
  verificationWork: null,
  loading: true,
  error: null,
  refresh: null,
};

async function GetAccountVerificationWorkFetcher([_, params]: [
  string,
  GetAccountVerificationWorkFetcherParams,
]): Promise<AccountVerificationWorkEntity> {
  if (!params.enabled) throw new ServerError(ErrorCodes.NOT_FOUND);

  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));
  const retrieve = new RetrieveAccountVerificationWorkUseCase(accountRepository, sessionRepository);

  const accountVerificationWork = await retrieve.execute();
  if (accountVerificationWork instanceof DataFailed) throw accountVerificationWork.error;
  if (!accountVerificationWork.data) throw new ServerError(ErrorCodes.NOT_FOUND);
  return accountVerificationWork.data;
}

export function useGetAccountVerificationWork(params: GetAccountVerificationWorkProps): UseGetAccountVerificationWorkReturnType {
  const clerk = useClerk();

  const shouldFetch = !!params.enabled;
  const { data, isLoading, error, mutate } = useSWR(
    shouldFetch ? [ACCOUNT_SWR_KEYS.GET_ACCOUNT_VERIFICATION_WORK, { enabled: params.enabled, clerk }] : null,
    GetAccountVerificationWorkFetcher,
  );

  if (!shouldFetch || isLoading) return INITIAL_STATE;
  if (error) {
    return {
      verificationWork: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: null,
    };
  }
  if (!data) return INITIAL_STATE;
  return { verificationWork: data, loading: false, error: null, refresh: mutate };
}
