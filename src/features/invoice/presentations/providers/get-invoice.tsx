"use client";

import React, { useEffect, useState } from "react";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { DataFailed } from "@/core/resources/data-state";
import { GetInvoiceUseCase, GetInvoiceUseCaseParams } from "@/features/invoice/domain/usecases/get-invoice";
import { HttpRequest } from "@/core/helpers/http-request";

interface GetInvoiceContextProps {
  invoice?: InvoiceEntity;
  loading: boolean;
  error?: ServerError;
}

interface GetInvoiceProviderProps {
  id: string;
  includes?: string;
  children: React.ReactNode;
}

const GetInvoiceContext = React.createContext<GetInvoiceContextProps>({
  loading: false,
});

export function GetInvoiceProvider(props: GetInvoiceProviderProps) {
  const [invoice, setInvoice] = useState<InvoiceEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ServerError>();

  const fetchInvoice = async (id: string, includes?: string) => {
    setLoading(true);
    setError(undefined);

    try {
      const httpRequest = new HttpRequest();
      const sessionService = new LocalStorageSessionService();
      const invoiceService = new InvoiceServiceImpl(httpRequest);
      const invoiceRepository = new InvoiceRepositoryImpl(invoiceService);
      const sessionRepository = new SessionRepositoryImpl(sessionService);

      const getInvoice = new GetInvoiceUseCase(invoiceRepository, sessionRepository);
      const getInvoiceParams = new GetInvoiceUseCaseParams({
        id: props.id,
        includes: includes,
      });

      const result = await getInvoice.execute(getInvoiceParams);
      if (result instanceof DataFailed) throw result.error;
      if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

      setInvoice(result.data);
      setLoading(false);
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      else setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  };

  useEffect(() => {
    fetchInvoice(props.id, props.includes);
  }, [props.id, props.includes]);

  return <GetInvoiceContext.Provider value={{ invoice, loading, error }}>{props.children}</GetInvoiceContext.Provider>;
}

export function useGetInvoice() {
  return React.useContext(GetInvoiceContext);
}
