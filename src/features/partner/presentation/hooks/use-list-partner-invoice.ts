import useSWR from "swr";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PartnerRepositoryImpl } from "@/features/partner/data/repositories/partner";
import {
  ListPartnerInvoiceUseCase,
  ListPartnerInvoiceUseCaseParams,
} from "@/features/partner/domain/usecases/list-partner-invoice";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
import { HttpRequest } from "@/core/helpers/http-request";

type ListPartnerInvoiceFetcherParams = { partner: { id: string }; limit?: number };

async function ListPartnerInvoiceFetcher([, params]: [string, ListPartnerInvoiceFetcherParams]): Promise<
  InvoiceEntity[]
> {
  const http = new HttpRequest();
  const sessionService = new LocalStorageSessionService();
  const partnerService = new PartnerServiceImpl(http);
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const partnerRepository = new PartnerRepositoryImpl(partnerService);
  const list = new ListPartnerInvoiceUseCase(partnerRepository, sessionRepository);
  const listParams = new ListPartnerInvoiceUseCaseParams({
    partner: { id: params.partner.id },
    searchParams: { limit: params.limit },
  });

  const result = await list.execute(listParams);
  if (result instanceof DataFailed) throw result.error;
  if (result.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (result.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

export function useListPartnerInvoice(params: ListPartnerInvoiceFetcherParams) {
  const { data, isLoading, error, mutate } = useSWR(["list-partner-invoice", params], ListPartnerInvoiceFetcher);

  return {
    invoices: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
