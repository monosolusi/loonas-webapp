import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import useSWR from "swr";
import { PaymentMethodPayInDetailEntity } from "@/features/payment/domain/entities/payment-method-pay-in-detail-entity";
import {
  GetIncomingInvoicePayInDetailUseCase,
  GetIncomingInvoicePayInDetailUseCaseParams,
} from "@/features/payment/domain/usecases/get-incoming-invoice-pay-in-detail-use-case";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";

type GetIncomingInvoicePayInDetailFetcherParams = {
  invoice: { id: string };
  clerk: ReturnType<typeof useClerk>;
};

async function GetIncomingInvoicePayInDetailFetcher([, params]: [
  string,
  GetIncomingInvoicePayInDetailFetcherParams,
]): Promise<PaymentMethodPayInDetailEntity> {
  const http = new HttpRequest();
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const invoiceRepository = new InvoiceRepositoryImpl(new InvoiceServiceImpl(http), new PayInDetailFactory());
  const get = new GetIncomingInvoicePayInDetailUseCase(invoiceRepository, sessionRepository);
  const getParams = new GetIncomingInvoicePayInDetailUseCaseParams({ invoice: { id: params.invoice.id } });

  const result = await get.execute(getParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useGetIncomingInvoicePayInDetail(params: { invoice: { id: string }; refreshInterval?: number }) {
  const clerk = useClerk();
  const { data, error, isLoading } = useSWR(
    ["get-incoming-invoice-pay-in-detail", { invoice: params.invoice, clerk }],
    GetIncomingInvoicePayInDetailFetcher,
    { refreshInterval: params.refreshInterval },
  );

  return {
    payInDetail: data,
    loading: isLoading,
    error: error,
  };
}
