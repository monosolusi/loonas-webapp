"use client";

import {ErrorCodes, ServerError} from "@/core/resources/server-error";
import React, {useEffect, useState} from "react";
import {DataFailed} from "@/core/resources/data-state";
import {SessionRepositoryImpl} from "@/features/authentication/data/repositories/session";
import {LocalStorageSessionService} from "@/features/authentication/data/sources/local-storage-session";
import {InvoiceEntity} from "../../domain/entities/invoice";
import {ListInvoiceUseCase} from "@/features/invoice/domain/usecases/list-invoice";
import {InvoiceRepositoryImpl} from "@/features/invoice/data/repositories/invoice";
import {InvoiceServiceImpl} from "@/features/invoice/data/services/invoice";

interface InvoiceContextProps {
  invoices: InvoiceEntity[],
  loading: boolean;
  error?: ServerError;
}

const InvoiceContext = React.createContext<InvoiceContextProps>({
  invoices: [],
  loading: false
});

export function InvoiceProvider(props: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<InvoiceEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ServerError>();

  async function fetchInvoices() {
    setLoading(true);
    setError(undefined);

    try {
      const sessionService = new LocalStorageSessionService();
      const invoiceService = new InvoiceServiceImpl();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const invoiceRepository = new InvoiceRepositoryImpl(invoiceService);
      const listInvoices = new ListInvoiceUseCase(invoiceRepository, sessionRepository);
      const result = await listInvoices.execute();
      if (result instanceof DataFailed) throw result.error;
      if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      setInvoices(result.data);
      setLoading(false);
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      else setError(new ServerError(ErrorCodes.UNKNOWN, {error: err}));
    }
  }

  useEffect(() => {
    fetchInvoices();
  }, [])

  return (
    <InvoiceContext.Provider
      value={{invoices, loading, error}}
    >
      {props.children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  return React.useContext(InvoiceContext);
}
