import { HttpRequest } from "@/core/helpers/http-request";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { ListAccountUseCase } from "@/features/account/domain/usecases/list-account";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";

async function ListAccountFetcher() {
  const http = new HttpRequest();
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const accountService = new AccountServiceImpl(http);
  const accountRepository = new AccountRepositoryImpl(accountService);
  const listAccount = new ListAccountUseCase(accountRepository, sessionRepository);
  const accounts = await listAccount.execute();
  if (accounts instanceof DataFailed) throw accounts.error;
  if (accounts.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (accounts.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);

  return accounts.data;
}

export function useListAccount() {
  const { data, isLoading, error, mutate } = useSWR("list-account", ListAccountFetcher);

  return {
    accounts: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
