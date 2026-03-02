"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import {
  GetCashFlowUseCase,
  GetCashFlowUseCaseParams,
} from "@/features/invoice/domain/usecases/get-cash-flow.usecases";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import useSWR from "swr";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useClerk } from "@clerk/nextjs";
import {
  GetCashFlowFetcherParams,
  UseGetCashFlowParams,
  UseGetCashFlowReturnType,
} from "@/features/invoice/presentations/hooks/use-get-cash-flow.types";

const INITIAL_STATE: UseGetCashFlowReturnType = {
  cashFlow: null,
  loading: true,
  error: null,
};

async function GetCashFlowFetcher([_, params]: [string, GetCashFlowFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const invoiceRepository = new InvoiceRepositoryImpl(
    new InvoiceServiceImpl(new HttpRequest()),
    new PayInDetailFactory(),
  );

  const get = new GetCashFlowUseCase(invoiceRepository, sessionRepository);
  const getParams = new GetCashFlowUseCaseParams({ month: params.month, year: params.year });

  const result = await get.execute(getParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useGetCashFlow(params: UseGetCashFlowParams): UseGetCashFlowReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    ["get-cash-flow", { ...params, clerk }],
    GetCashFlowFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      cashFlow: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    cashFlow: data,
    loading: false,
    error: null,
  };
}
