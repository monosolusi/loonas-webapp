import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  DeleteOutgoingInvoiceUseCase,
  DeleteOutgoingInvoiceUseCaseParams,
} from "@/features/invoice/domain/usecases/delete-outgoing-invoice.usecases";
import useSWRMutation from "swr/mutation";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { useClerk } from "@clerk/nextjs";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

interface DeleteInvoiceFetcherParams {
  invoice: { id: string };
  clerk: ReturnType<typeof useClerk>;
}

async function DeleteInvoiceFetcher(_: string, { arg }: { arg: DeleteInvoiceFetcherParams }): Promise<boolean> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));

  const http = new HttpRequest();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService, new PayInDetailFactory());
  const remove = new DeleteOutgoingInvoiceUseCase(invoiceRepository, sessionRepository);
  const removeParams = new DeleteOutgoingInvoiceUseCaseParams({ invoice: { id: arg.invoice.id } });

  const result = await remove.execute(removeParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useDeleteInvoice() {
  const clerk = useClerk();
  const { trigger: baseTrigger, ...rest } = useSWRMutation(INVOICE_SWR_KEYS.DELETE_INVOICE, DeleteInvoiceFetcher);

  const trigger = (params: { invoice: { id: string } }) => baseTrigger({ ...params, clerk });

  return { trigger, ...rest };
}
