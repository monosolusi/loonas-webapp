import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import { ListCombinedInvoiceSummaryUseCase } from "@/features/invoice/domain/usecases/list-combined-invoice-summary";
import { CombinedInvoiceSummaryEntity } from "@/features/invoice/domain/entities/combined-invoice-summary";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";

async function combinedInvoiceSummaryFetcher(): Promise<CombinedInvoiceSummaryEntity[]> {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const http = new HttpRequest();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService, new PayInDetailFactory());
  const list = new ListCombinedInvoiceSummaryUseCase(invoiceRepository, sessionRepository);
  const invoices = await list.execute();
  if (invoices instanceof DataFailed) throw invoices.error;
  if (!invoices.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return invoices.data;
}

export function useCombinedInvoiceSummary() {
  const { data, isLoading, error, mutate } = useSWR("combined-invoice-summary", combinedInvoiceSummaryFetcher);

  return {
    invoices: data ?? [],
    loading: isLoading,
    error: error,
    mutate: mutate,
  };
}
