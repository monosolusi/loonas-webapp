"use client";

import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import { BankRepositoryImpl } from "@/features/bank/data/repositories/bank";
import { ListBanksUseCase } from "@/features/bank/domain/usecases/list-banks";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import { ListBankFetcherParams } from "@/features/bank/presentation/hooks/use-list-bank.types";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useClerk } from "@clerk/nextjs";

async function ListBankFetcher([, params]: [string, ListBankFetcherParams]): Promise<BankEntity[]> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const bankRepository = new BankRepositoryImpl(new BankServiceImpl());
  const listBanks = new ListBanksUseCase(bankRepository, sessionRepository);

  const result = await listBanks.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListBank() {
  const clerk = useClerk();
  const { data, error, isLoading } = useSWR(["list-bank", { clerk }], ListBankFetcher);

  return {
    banks: data ?? [],
    loading: isLoading,
    error: error,
  };
}
