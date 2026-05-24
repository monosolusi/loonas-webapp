import { HttpRequest } from "@/core/helpers/http-request";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { InvoiceRepositoryImpl } from "../../data/repositories/invoice";
import { InvoiceServiceImpl } from "../../data/sources/invoice";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { GetInvoiceUseCase, GetInvoiceUseCaseParams } from "../../domain/usecases/get-invoice.usecases";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import useSWR from "swr";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

interface GetIncomingInvoiceFetcherParams {
  id: string;
  includes?: string;
}

async function GetIncomingInvoiceFetcher([_, params]: [string, GetIncomingInvoiceFetcherParams]) {
  const http = new HttpRequest();
  const sessionService = new LocalStorageSessionService();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService, new PayInDetailFactory());
  const sessionRepository = new SessionRepositoryImpl(sessionService);

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

/**
 * @deprecated Use `useGetInvoice` from `@/features/invoice/presentations/hooks/use-get-invoice` instead.
 */
export function useGetIncomingInvoice(params: GetIncomingInvoiceFetcherParams) {
  const { data, isLoading, error } = useSWR([INVOICE_SWR_KEYS.GET_INCOMING_INVOICE, params], GetIncomingInvoiceFetcher);

  return {
    invoice: data,
    loading: isLoading,
    error: error,
  };
}
