import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceRepositoryImpl } from "../../data/repositories/invoice";
import { InvoiceServiceImpl } from "../../data/sources/invoice";
import { DataFailed } from "@/core/resources/data-state";
import useSWR from "swr";
import { PublicOutgoingInvoiceEntity } from "../../domain/entities/public-outgoing-invoice";
import {
  GetPublicOutgoingInvoiceUseCase,
  GetPublicOutgoingInvoiceUseCaseParams,
} from "../../domain/usecases/get-public-outgoing-invoice";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

interface GetPublicOutgoingInvoiceFetcherParams {
  id: string;
}

async function GetPublicOutgoingInvoiceFetcher([_, params]: [
  string,
  GetPublicOutgoingInvoiceFetcherParams,
]): Promise<PublicOutgoingInvoiceEntity> {
  const http = new HttpRequest();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService, new PayInDetailFactory());
  const get = new GetPublicOutgoingInvoiceUseCase(invoiceRepository);
  const getParams = new GetPublicOutgoingInvoiceUseCaseParams({ invoiceId: params.id });

  const result = await get.execute(getParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetPublicOutgoingInvoice(Params: GetPublicOutgoingInvoiceFetcherParams) {
  const { data, isLoading, error } = useSWR([INVOICE_SWR_KEYS.GET_PUBLIC_OUTGOING_INVOICE, Params], GetPublicOutgoingInvoiceFetcher);

  return {
    invoice: data,
    loading: isLoading,
    error: error,
  };
}
