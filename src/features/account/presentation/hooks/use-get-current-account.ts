import {useAuth} from "@clerk/nextjs";
import useSWR from "swr";
import {GetAccountFetcherParams} from "@/features/account/presentation/hooks/use-get-current-account.types";
import {SessionRepositoryImpl} from "@/features/authentication/data/repositories/session";
import {AccountRepositoryImpl} from "@/features/account/data/repositories/account";
import {ClerkSessionService} from "@/features/authentication/data/sources/clerk-session.service";
import {AccountServiceImpl} from "@/features/account/data/sources/account";
import {HttpRequest} from "@/core/helpers/http-request";
import {DataFailed} from "@/core/resources/data-state";
import {ErrorCodes, ServerError} from "@/core/resources/server-error";
import {GetCurrentAccountUseCase} from "@/features/account/domain/usecases/get-current-account.usecase";

async function GetCurrentAccount([_, params]: [string, GetAccountFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ getToken: params.getToken }));
  const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));
  const get = new GetCurrentAccountUseCase(accountRepository, sessionRepository);
  const account = await get.execute();
  if (account instanceof DataFailed) throw account.error;
  if (!account.data) throw new ServerError(ErrorCodes.NOT_FOUND);
  return account.data;
}

export function useGetCurrentAccount() {
  const { getToken } = useAuth();
  const { data, isLoading, error, mutate } = useSWR(["get-account", { getToken }], GetCurrentAccount);

  return {
    account: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
