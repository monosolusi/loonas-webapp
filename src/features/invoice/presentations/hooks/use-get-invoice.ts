"use client";

import { useCallback } from "react";
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
import { InvoiceDetailEntity } from "@/features/invoice/domain/types/invoice-detail";
import {
  GetInvoiceFetcherParams,
  UseGetInvoiceParams,
  UseGetInvoiceReturnType,
} from "@/features/invoice/presentations/hooks/use-get-invoice.types";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

export type UseGetInvoiceOptions = {
  refreshInterval?: number | ((latestData: InvoiceDetailEntity | undefined) => number);
};

function buildInitialState(refresh: () => Promise<void>): UseGetInvoiceReturnType {
  return { invoice: null, loading: true, error: null, refresh };
}

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

export function useGetInvoice(
  params: UseGetInvoiceParams,
  options: UseGetInvoiceOptions = {},
): UseGetInvoiceReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [INVOICE_SWR_KEYS.GET_INVOICE, { ...params, clerk }],
    GetInvoiceFetcher,
    { refreshInterval: options.refreshInterval },
  );

  const refresh = useCallback(async (): Promise<void> => {
    await mutate();
  }, [mutate]);

  if (isLoading) return buildInitialState(refresh);
  if (error) {
    return {
      invoice: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh,
    };
  }

  if (!data) return buildInitialState(refresh);

  return {
    invoice: data,
    loading: false,
    error: null,
    refresh,
  };
}
