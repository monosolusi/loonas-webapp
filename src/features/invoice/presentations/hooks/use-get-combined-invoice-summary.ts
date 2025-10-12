import useSWR from "swr";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import {
  GetCombinedInvoiceSummaryUseCase,
  GetCombinedInvoiceSummaryUseCaseParams
} from "@/features/invoice/domain/usecases/get-combined-invoice-summary";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";

interface UseGetCombinedInvoiceSummaryProps {
  id: string;
}

async function getCombinedInvoiceSummaryFetcher([_, id]: [string, string]) {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);

  const http = new HttpRequest();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService, new PayInDetailFactory());
  const retrieve = new GetCombinedInvoiceSummaryUseCase(invoiceRepository, sessionRepository);
  const retrieveParams = new GetCombinedInvoiceSummaryUseCaseParams({ id });

  const invoice = await retrieve.execute(retrieveParams);
  if (invoice instanceof DataFailed) throw invoice.error;
  if (!invoice.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return invoice.data;
}

export function useGetCombinedInvoiceSummary(props: UseGetCombinedInvoiceSummaryProps) {
  const { data, error, isLoading } = useSWR(
    ["get-combined-invoice-summary", props.id],
    getCombinedInvoiceSummaryFetcher,
  );

  return {
    invoice: data,
    loading: isLoading,
    error: error,
  };
}
