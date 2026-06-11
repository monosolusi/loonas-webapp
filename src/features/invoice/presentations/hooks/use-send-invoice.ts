import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SendInvoiceUseCase, SendInvoiceUseCaseParams } from "@/features/invoice/domain/usecases/send-invoice";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import useSWRMutation from "swr/mutation";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { useClerk } from "@clerk/nextjs";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

interface SendInvoiceFetcherParams {
  invoice: { id: string };
  sendChannel: NotificationChannel[];
  clerk: ReturnType<typeof useClerk>;
}

async function SendInvoiceFetcher(_: string, { arg }: { arg: SendInvoiceFetcherParams }): Promise<boolean> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));

  const http = new HttpRequest();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService, new PayInDetailFactory());
  const send = new SendInvoiceUseCase(invoiceRepository, sessionRepository);
  const sendParams = new SendInvoiceUseCaseParams({
    invoice: { id: arg.invoice.id },
    sendChannel: arg.sendChannel,
  });

  const result = await send.execute(sendParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useSendInvoice() {
  const clerk = useClerk();
  const { trigger: baseTrigger, ...rest } = useSWRMutation(INVOICE_SWR_KEYS.SEND_INVOICE, SendInvoiceFetcher);

  const trigger = (params: { invoice: { id: string }; sendChannel: NotificationChannel[] }) =>
    baseTrigger({ ...params, clerk });

  return { trigger, ...rest };
}
