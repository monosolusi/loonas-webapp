import { DateTime } from "luxon";
import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaymentRequestEntity } from "@/features/payment/domain/entities/payment-request";
import { PaymentRequestRepository } from "@/features/payment/domain/repositories/payment-request";

export interface InvoiceDocument {
  file: File;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
}

interface UploadPaymentRequestInvoicesUseCaseParamsConstructor {
  paymentRequest: PaymentRequestEntity;
  invoices: InvoiceDocument[];
}

export class UploadPaymentRequestInvoicesUseCaseParams {
  public paymentRequest: PaymentRequestEntity;
  public invoices: InvoiceDocument[];

  constructor(args: UploadPaymentRequestInvoicesUseCaseParamsConstructor) {
    this.paymentRequest = args.paymentRequest;
    this.invoices = args.invoices;
  }
}

export class UploadPaymentRequestInvoicesUseCase implements UseCase<DataState<boolean>, UploadPaymentRequestInvoicesUseCaseParams> {
  constructor(
    private readonly paymentRequestRepository: PaymentRequestRepository,
    private readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: UploadPaymentRequestInvoicesUseCaseParams): Promise<DataState<boolean>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // Validasi masukan
      if (!params.paymentRequest) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!params.invoices || params.invoices.length === 0) throw new ServerError(ErrorCodes.EMPTY_INVOICES);

      const result = await this.paymentRequestRepository.uploadInvoices({
        paymentRequest: params.paymentRequest,
        invoices: params.invoices
      }, session.data);

      if (result instanceof DataFailed) return result;
      return new DataSuccess(true);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}