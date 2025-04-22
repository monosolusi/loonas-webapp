"use client";

import React, { useEffect, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { DataFailed } from "@/core/resources/data-state";
import { PartnerEntity } from "../../domain/entities/partner";
import { PartnerRepositoryImpl } from "../../data/repositories/partner";
import { PartnerServiceImpl } from "../../data/sources/partner";
import { ListPartnerUseCase } from "../../domain/usecases/list-partner";

interface ListPartnerContextProps {
  partners: PartnerEntity[];
  loading: boolean;
  refreshPartners?: () => Promise<void>;
}

const ListPartnerContext = React.createContext<ListPartnerContextProps>({
  partners: [],
  loading: false
});

export function ListPartnerProvider({ children }: { children: React.ReactNode }) {
  const [partners, setPartners] = useState<PartnerEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const partnerService = new PartnerServiceImpl();
      const partnerRepository = new PartnerRepositoryImpl(partnerService);
      const listPartners = new ListPartnerUseCase(partnerRepository, sessionRepository);

      const partners = await listPartners.execute();
      if (partners instanceof DataFailed) throw partners.error;
      if (partners.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (partners.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);

      setPartners(partners.data);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err);
    }
  }

  async function refreshPartners() {
    await loadData();
  }

  return (
    <ListPartnerContext.Provider value={{ partners, loading, refreshPartners }}>
      {children}
    </ListPartnerContext.Provider>
  );
}

export function useListPartner() {
  return React.useContext(ListPartnerContext);
}