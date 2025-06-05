import { DataFailed } from "@/core/resources/data-state";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import {
  GetOutgoingInvoiceUseCase,
  GetOutgoingInvoiceUseCaseParams,
} from "@/features/invoice/domain/usecases/get-outgoing-invoice";

interface GetOutgoingInvoiceFetcherParams {
  id: string;
}

async function GetOutgoingInvoiceFetcher([_, param]: [string, GetOutgoingInvoiceFetcherParams]) {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);

  const http = new HttpRequest();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService);
  const retrieve = new GetOutgoingInvoiceUseCase(invoiceRepository, sessionRepository);
  const retrieveParams = new GetOutgoingInvoiceUseCaseParams({ id: param.id });

  const invoice = await retrieve.execute(retrieveParams);
  if (invoice instanceof DataFailed) throw invoice.error;
  if (!invoice.data) throw new ServerError(ErrorCodes.NOT_FOUND);
  return invoice.data;
}

export function useGetOutgoingInvoice(props: GetOutgoingInvoiceFetcherParams) {
  const { data, isLoading, error, mutate } = useSWR(["get-outgoing-invoice", props], GetOutgoingInvoiceFetcher);

  return {
    invoice: data,
    loading: isLoading,
    error: error,
    refreshInvoice: mutate,
  };
}
