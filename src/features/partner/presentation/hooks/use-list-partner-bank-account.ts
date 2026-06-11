import {
  ListPartnerBankAccountFetcherParams,
  UseListPartnerBankAccountProps,
} from "@/features/partner/presentation/hooks/use-list-partner-bank-account.types";
import { useClerk } from "@clerk/nextjs";
import useSWR from "swr";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { BankRepositoryImpl } from "@/features/bank/data/repositories/bank";
import {
  ListBankAccountsUseCase,
  ListBankAccountsUseCaseParams,
} from "@/features/bank/domain/usecases/list-bank-accounts";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { DataFailed } from "@/core/resources/data-state";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";

async function ListPartnerBankAccountFetcher([_, params]: [string, ListPartnerBankAccountFetcherParams]): Promise<
  BankAccountEntity[]
> {
  if (!params.partner?.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const bankRepository = new BankRepositoryImpl(new BankServiceImpl());
  const list = new ListBankAccountsUseCase(bankRepository, sessionRepository);
  const listParams = new ListBankAccountsUseCaseParams(params.partner.id);

  const result = await list.execute(listParams);
  if (result instanceof DataFailed) throw result.error;
  if (result.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (result.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useListPartnerBankAccount(props: UseListPartnerBankAccountProps) {
  const clerk = useClerk();

  const shouldFetch = props.partner?.id !== undefined;
  const { data, isLoading, error, mutate } = useSWR(
    shouldFetch ? ["list-partner-bank-account", { ...props, clerk }] : null,
    ListPartnerBankAccountFetcher,
  );

  if (error instanceof ServerError && error.code === ErrorCodes.NOT_FOUND.code) {
    return { banks: [], loading: false, error: undefined, refreshPartners: mutate };
  }

  return {
    banks: data ?? [],
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
