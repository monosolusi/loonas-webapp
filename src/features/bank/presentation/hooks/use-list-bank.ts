"use client";

import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import { BankRepositoryImpl } from "@/features/bank/data/repositories/bank";
import { ListBanksUseCase } from "@/features/bank/domain/usecases/list-banks";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";

async function listBank(): Promise<BankEntity[]> {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const bankService = new BankServiceImpl();
  const bankRepository = new BankRepositoryImpl(bankService);
  const listBanks = new ListBanksUseCase(bankRepository, sessionRepository);

  const result = await listBanks.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListBank() {
  const { data, error, isLoading } = useSWR("list-bank", listBank);

  return {
    banks: data ?? [],
    loading: isLoading,
    error: error
  };
}
