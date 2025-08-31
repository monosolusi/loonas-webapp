import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { InvoiceServiceImpl } from "../../data/sources/invoice";
import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceRepositoryImpl } from "../../data/repositories/invoice";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PayInEntity } from "../../domain/entities/pay-in";
import {
  CreateOutgoingInvoicePayInUseCase,
  CreateOutgoingInvoicePayInUseCaseParams,
} from "../../domain/usecases/create-outgoing-invoice-pay-in";
import useSWRMutation from "swr/mutation";

interface CreateOutgoingInvoicePayInParams {
  invoiceId: string;
  paymentMethodId: string;
  paymentScheme?: string | null;
}

async function CreateOutgoingInvoicePayInFetcher(
  _: string,
  { arg }: { arg: CreateOutgoingInvoicePayInParams },
): Promise<PayInEntity> {
  const http = new HttpRequest();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService);

  const create = new CreateOutgoingInvoicePayInUseCase(invoiceRepository);
  const createParams = new CreateOutgoingInvoicePayInUseCaseParams({
    invoiceId: arg.invoiceId,
    paymentMethodId: arg.paymentMethodId,
    paymentSchemeId: arg.paymentScheme || null,
  });

  const result = await create.execute(createParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreateOutgoingInvoicePayIn() {
  return useSWRMutation("create-outgoing-invoice-pay-in", CreateOutgoingInvoicePayInFetcher);
}
