"use client";

import React, { useEffect, useState } from "react";
import { BankEntity } from "../../domain/entities/bank";
import { BankRepositoryImpl } from "../../data/repositories/bank";
import { BankServiceImpl } from "../../data/sources/bank";
import { ServerError, ErrorCodes } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { ListBanksUseCase } from "../../domain/usecases/list-banks";
import { DataFailed } from "@/core/resources/data-state";

interface ListBankContextProps {
  banks: BankEntity[];
  loading: boolean;
  error?: ServerError;
  refreshBanks?: () => Promise<void>;
}

const ListBankContext = React.createContext<ListBankContextProps>({
  banks: [],
  loading: false
});

export function ListBankProvider({ children }: { children: React.ReactNode }) {
  const [banks, setBanks] = useState<BankEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ServerError | undefined>(undefined);

  async function fetchBanks() {
    setLoading(true);
    setError(undefined);

    try {
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const bankService = new BankServiceImpl();
      const bankRepository = new BankRepositoryImpl(bankService);
      const listBanks = new ListBanksUseCase(bankRepository, sessionRepository);

      const result = await listBanks.execute();
      if (result instanceof DataFailed) {
        setError(result.error as ServerError);
        return;
      }

      if (!result.data) {
        setError(new ServerError(ErrorCodes.INVALID_INSTANCE));
        return;
      }

      setBanks(result.data);
    } catch (err) {
      console.error(err);
      if (err instanceof ServerError) {
        setError(err);
      } else {
        setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBanks();
  }, []);

  return (
    <ListBankContext.Provider
      value={{
        banks,
        loading,
        error,
        refreshBanks: fetchBanks
      }}
    >
      {children}
    </ListBankContext.Provider>
  );
}

export function useListBank() {
  return React.useContext(ListBankContext);
}