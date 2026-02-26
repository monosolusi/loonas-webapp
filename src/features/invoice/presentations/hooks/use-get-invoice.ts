"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceRepositoryImpl } from "../../data/repositories/invoice";
import { InvoiceServiceImpl } from "../../data/sources/invoice";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { GetInvoiceUseCase, GetInvoiceUseCaseParams } from "../../domain/usecases/get-invoice.usecases";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import useSWR from "swr";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useClerk } from "@clerk/nextjs";
import {
  GetInvoiceFetcherParams,
  UseGetInvoiceParams,
  UseGetInvoiceReturnType,
} from "@/features/invoice/presentations/hooks/use-get-invoice.types";

const INITIAL_STATE: UseGetInvoiceReturnType = {
  invoice: null,
  loading: true,
  error: null,
};

async function GetInvoiceFetcher([_, params]: [string, GetInvoiceFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const invoiceRepository = new InvoiceRepositoryImpl(
    new InvoiceServiceImpl(new HttpRequest()),
    new PayInDetailFactory(),
  );

  const get = new GetInvoiceUseCase(invoiceRepository, sessionRepository);
  const getParams = new GetInvoiceUseCaseParams({
    id: params.id,
    includes: params.includes,
  });

  const result = await get.execute(getParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useGetInvoice(params: UseGetInvoiceParams): UseGetInvoiceReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["get-invoice", { ...params, clerk }], GetInvoiceFetcher);

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      invoice: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    invoice: data,
    loading: false,
    error: null,
  };
}
