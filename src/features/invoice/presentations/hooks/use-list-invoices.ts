"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ListInvoicesUseCase, ListInvoicesUseCaseParams } from "@/features/invoice/domain/usecases/list-invoices.usecases";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import useSWR from "swr";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useClerk } from "@clerk/nextjs";
import {
  ListInvoicesFetcherParams,
  UseListInvoicesParams,
  UseListInvoicesReturnType,
} from "@/features/invoice/presentations/hooks/use-list-invoices.types";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

const INITIAL_STATE: UseListInvoicesReturnType = {
  invoices: null,
  meta: null,
  loading: true,
  error: null,
};

async function ListInvoicesFetcher([_, params]: [string, ListInvoicesFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const invoiceRepository = new InvoiceRepositoryImpl(
    new InvoiceServiceImpl(new HttpRequest()),
    new PayInDetailFactory(),
  );

  const list = new ListInvoicesUseCase(invoiceRepository, sessionRepository);
  const listParams = new ListInvoicesUseCaseParams({
    type: params.type,
    channel: params.channel,
    page: params.page,
    limit: params.limit,
    includes: params.includes,
    filter: params.filter,
    from: params.from,
    to: params.to,
  });

  const result = await list.execute(listParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useListInvoices(params: UseListInvoicesParams): UseListInvoicesReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR([INVOICE_SWR_KEYS.LIST_INVOICES, { ...params, clerk }], ListInvoicesFetcher);

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      invoices: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    invoices: data.data,
    meta: data.meta,
    loading: false,
    error: null,
  };
}
