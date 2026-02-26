"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import {
  GetInvoiceTimelineUseCase,
  GetInvoiceTimelineUseCaseParams,
} from "@/features/invoice/domain/usecases/get-invoice-timeline.usecases";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import useSWR from "swr";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useClerk } from "@clerk/nextjs";
import {
  GetInvoiceTimelineFetcherParams,
  UseGetInvoiceTimelineParams,
  UseGetInvoiceTimelineReturnType,
} from "@/features/invoice/presentations/hooks/use-get-invoice-timeline.types";

const INITIAL_STATE: UseGetInvoiceTimelineReturnType = {
  timeline: null,
  loading: true,
  error: null,
};

async function GetInvoiceTimelineFetcher([_, params]: [string, GetInvoiceTimelineFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const invoiceRepository = new InvoiceRepositoryImpl(
    new InvoiceServiceImpl(new HttpRequest()),
    new PayInDetailFactory(),
  );

  const get = new GetInvoiceTimelineUseCase(invoiceRepository, sessionRepository);
  const getParams = new GetInvoiceTimelineUseCaseParams({ id: params.id });

  const result = await get.execute(getParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useGetInvoiceTimeline(params: UseGetInvoiceTimelineParams): UseGetInvoiceTimelineReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    ["get-invoice-timeline", { ...params, clerk }],
    GetInvoiceTimelineFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      timeline: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    timeline: data,
    loading: false,
    error: null,
  };
}
