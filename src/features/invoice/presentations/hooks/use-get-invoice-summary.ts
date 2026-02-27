"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import {
  GetInvoiceSummaryUseCase,
  GetInvoiceSummaryUseCaseParams,
} from "@/features/invoice/domain/usecases/get-invoice-summary.usecases";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import useSWR from "swr";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useClerk } from "@clerk/nextjs";
import {
  GetInvoiceSummaryFetcherParams,
  UseGetInvoiceSummaryParams,
  UseGetInvoiceSummaryReturnType,
} from "@/features/invoice/presentations/hooks/use-get-invoice-summary.types";

const INITIAL_STATE: UseGetInvoiceSummaryReturnType = {
  summary: null,
  loading: true,
  error: null,
};

async function GetInvoiceSummaryFetcher([_, params]: [string, GetInvoiceSummaryFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const invoiceRepository = new InvoiceRepositoryImpl(
    new InvoiceServiceImpl(new HttpRequest()),
    new PayInDetailFactory(),
  );

  const get = new GetInvoiceSummaryUseCase(invoiceRepository, sessionRepository);
  const getParams = new GetInvoiceSummaryUseCaseParams({ type: params.type });

  const result = await get.execute(getParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useGetInvoiceSummary(params: UseGetInvoiceSummaryParams): UseGetInvoiceSummaryReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    ["get-invoice-summary", { ...params, clerk }],
    GetInvoiceSummaryFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      summary: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    summary: data,
    loading: false,
    error: null,
  };
}
