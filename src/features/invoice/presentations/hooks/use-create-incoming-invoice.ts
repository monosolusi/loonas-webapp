import { CreateIncomingInvoiceFetcherParams } from "@/features/invoice/presentations/hooks/use-create-incoming-invoice.types";
import { PaymentRequestEntity } from "@/features/payment/domain/entities/payment-request";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PaymentRequestRepositoryImpl } from "@/features/payment/data/repositories/payment-request";
import { PaymentRequestServiceImpl } from "@/features/payment/data/sources/payment-request";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import { HttpRequest } from "@/core/helpers/http-request";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import { PaymentGatewayServiceImpl } from "@/features/payment/data/sources/payment-gateway";
import {
  CreatePaymentRequestUseCase,
  CreatePaymentRequestUseCaseParams,
} from "@/features/payment/domain/usecases/create-payment-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  UploadPaymentRequestInvoicesUseCase,
  UploadPaymentRequestInvoicesUseCaseParams,
} from "@/features/payment/domain/usecases/upload-payment-request-invoices";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

async function CreateIncomingInvoiceFetcher(
  _: string,
  { arg }: { arg: CreateIncomingInvoiceFetcherParams },
): Promise<PaymentRequestEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const paymentRequestRepository = new PaymentRequestRepositoryImpl(
    new PaymentRequestServiceImpl(
      new PartnerServiceImpl(new HttpRequest()),
      new BankServiceImpl(),
      new PaymentGatewayServiceImpl(),
    ),
  );

  const create = new CreatePaymentRequestUseCase(paymentRequestRepository, sessionRepository);
  const createParams = new CreatePaymentRequestUseCaseParams({
    receiver: arg.recipient,
    bankAccount: arg.bankAccount,
    invoices: arg.invoices,
    paymentMethod: arg.paymentGateway,
    paymentScheme: arg.paymentScheme,
  });

  const invoiceResult = await create.execute(createParams);
  if (invoiceResult instanceof DataFailed) throw invoiceResult.error;
  if (!invoiceResult.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const upload = new UploadPaymentRequestInvoicesUseCase(paymentRequestRepository, sessionRepository);
  const uploadParams = new UploadPaymentRequestInvoicesUseCaseParams({
    paymentRequest: invoiceResult.data,
    invoices: arg.invoices,
  });

  const uploadResult = await upload.execute(uploadParams);
  if (uploadResult instanceof DataFailed) throw uploadResult.error;
  if (!uploadResult.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return invoiceResult.data;
}

export function useCreateIncomingInvoice() {
  return useSWRMutationClerk(INVOICE_SWR_KEYS.CREATE_INCOMING_INVOICE, CreateIncomingInvoiceFetcher);
}
