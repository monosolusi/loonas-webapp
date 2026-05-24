import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import {
  GetPublicPayInDetailForOutgoingInvoiceUseCase,
  GetPublicPayInDetailForOutgoingInvoiceUseCaseParams,
} from "@/features/invoice/domain/usecases/get-public-pay-in-detail-for-outgoing-invoice";
import { PayInDetailRepositoryImpl } from "@/features/payment/data/repositories/pay-in-detail";
import { PayInDetailServiceImpl } from "@/features/payment/data/sources/pay-in-detail";
import { HttpRequest } from "@/core/helpers/http-request";
import { PublicPayInDetailEntity } from "@/features/payment/domain/entities/public-pay-in-detail";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

interface GetPublicPayInDetailForOutgoingInvoiceFetcherParams {
  invoiceId: string;
}

async function GetPublicPayInDetailForOutgoingInvoiceFetcher([_, params]: [
  string,
  GetPublicPayInDetailForOutgoingInvoiceFetcherParams,
]): Promise<PublicPayInDetailEntity> {
  const http = new HttpRequest();
  const payInDetailService = new PayInDetailServiceImpl(http);
  const payInDetailRepository = new PayInDetailRepositoryImpl(payInDetailService);

  const get = new GetPublicPayInDetailForOutgoingInvoiceUseCase(payInDetailRepository);
  const getParams = new GetPublicPayInDetailForOutgoingInvoiceUseCaseParams({
    invoiceId: params.invoiceId,
  });

  const result = await get.execute(getParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetPublicPayInDetailForOutgoingInvoice(params: GetPublicPayInDetailForOutgoingInvoiceFetcherParams) {
  const { data, isLoading, error, mutate } = useSWR(
    [INVOICE_SWR_KEYS.GET_PUBLIC_PAY_IN_DETAIL_FOR_OUTGOING_INVOICE, params],
    GetPublicPayInDetailForOutgoingInvoiceFetcher,
  );

  return {
    payIn: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
