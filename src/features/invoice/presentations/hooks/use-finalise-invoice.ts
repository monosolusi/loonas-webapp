import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  FinaliseOutgoingInvoiceUseCase,
  FinaliseOutgoingInvoiceUseCaseParams,
} from "@/features/invoice/domain/usecases/finalise-outgoing-invoice.usecases";
import useSWRMutation from "swr/mutation";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { useClerk } from "@clerk/nextjs";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";

interface FinaliseInvoiceFetcherParams {
  invoice: { id: string };
  clerk: ReturnType<typeof useClerk>;
}

async function FinaliseInvoiceFetcher(
  _: string,
  { arg }: { arg: FinaliseInvoiceFetcherParams },
): Promise<OutgoingInvoiceEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));

  const http = new HttpRequest();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService, new PayInDetailFactory());
  const finalise = new FinaliseOutgoingInvoiceUseCase(invoiceRepository, sessionRepository);
  const finaliseParams = new FinaliseOutgoingInvoiceUseCaseParams({ invoice: { id: arg.invoice.id } });

  const result = await finalise.execute(finaliseParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useFinaliseInvoice() {
  const clerk = useClerk();
  const { trigger: baseTrigger, ...rest } = useSWRMutation(INVOICE_SWR_KEYS.FINALISE_INVOICE, FinaliseInvoiceFetcher);

  const trigger = (params: { invoice: { id: string } }) => baseTrigger({ ...params, clerk });

  return { trigger, ...rest };
}
