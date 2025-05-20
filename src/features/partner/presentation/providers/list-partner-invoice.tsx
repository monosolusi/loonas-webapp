"use client";

import React, { useEffect, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { PartnerRepositoryImpl } from "@/features/partner/data/repositories/partner";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import { DataFailed } from "@/core/resources/data-state";
import {
  ListPartnerInvoiceUseCase,
  ListPartnerInvoiceUseCaseParams
} from "@/features/partner/domain/usecases/list-partner-invoice";

interface ListPartnerInvoiceContextProps {
  invoices: InvoiceEntity[],
  loading: boolean;
  error?: ServerError;
}

interface ListPartnerInvoiceProviderProps {
  children: React.ReactNode;
  partnerId: string;
  limit?: number;
}

const ListPartnerInvoiceContext = React.createContext<ListPartnerInvoiceContextProps>({
  invoices: [],
  loading: false
});

export function ListPartnerInvoiceProvider(props: ListPartnerInvoiceProviderProps) {
  const [invoices, setInvoices] = useState<InvoiceEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ServerError>();

  const fetchInvoices = async (partnerId: string, limit?: number) => {
    setLoading(true);
    setError(undefined);

    try {
      const sessionService = new LocalStorageSessionService();
      const partnerService = new PartnerServiceImpl();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const partnerRepository = new PartnerRepositoryImpl(partnerService);
      const list = new ListPartnerInvoiceUseCase(partnerRepository, sessionRepository);
      const listParams = new ListPartnerInvoiceUseCaseParams({
        partnerId: partnerId,
        searchParams: { limit: limit }
      });

      const result = await list.execute(listParams);
      if (result instanceof DataFailed) throw result.error;
      if (result.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (result.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);

      setInvoices(result.data);
      setLoading(false);
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  };

  useEffect(() => {
    fetchInvoices(props.partnerId, props.limit);
  }, [props.partnerId, props.limit]);

  return (
    <ListPartnerInvoiceContext.Provider
      value={{ invoices, loading, error }}
    >
      {props.children}
    </ListPartnerInvoiceContext.Provider>
  );
}

export function useListPartnerInvoice() {
  return React.useContext(ListPartnerInvoiceContext);
}
