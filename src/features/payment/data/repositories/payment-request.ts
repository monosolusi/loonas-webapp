import {DataFailed, DataState, DataSuccess} from "@/core/resources/data-state";
import {
  PaymentRequestRepository,
  PaymentRequestRepositoryCreateParams,
  PaymentRequestRepositoryGetParams,
  PaymentRequestRepositoryUploadInvoicesParams
} from "@/features/payment/domain/repositories/payment-request";
import {PaymentRequestEntity} from "@/features/payment/domain/entities/payment-request";
import {ErrorCodes, ServerError} from "@/core/resources/server-error";
import {PaymentRequestService} from "@/features/payment/data/sources/payment-request";
import {SessionEntity} from "@/features/authentication/domain/entities/session";

export class PaymentRequestRepositoryImpl implements PaymentRequestRepository {
  constructor(
    private readonly paymentRequestService: PaymentRequestService
  ) {
  }

  public async get(params: PaymentRequestRepositoryGetParams, session: SessionEntity): Promise<DataState<PaymentRequestEntity>> {
    try {
      const paymentRequest = await this.paymentRequestService.get({
        id: params.id,
        includes: params.includes
      }, session);

      return new DataSuccess(paymentRequest.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, {error: err}));
    }
  }

  public async uploadInvoices(params: PaymentRequestRepositoryUploadInvoicesParams, session: SessionEntity): Promise<DataState<boolean>> {
    try {
      await this.paymentRequestService.uploadInvoices({
        requestId: params.paymentRequest.id,
        invoiceDocuments: params.invoices.map(invoice => invoice.file)
      }, session);

      return new DataSuccess(true);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, {error: err}));
    }
  }

  public async create(params: PaymentRequestRepositoryCreateParams, session: SessionEntity): Promise<DataState<PaymentRequestEntity>> {
    try {
      const paymentRequest = await this.paymentRequestService.create({
        receiverId: params.receiver.id,
        receiverBankAccountId: params.bankAccount.id,
        invoices: params.invoices.map(invoice => ({
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.amount,
          dueDate: invoice.dueDate,
          invoiceDate: invoice.invoiceDate,
          note: invoice.note
        })),
        paymentMethodId: params.paymentMethod.id,
        paymentSchemeId: params.paymentScheme?.id
      }, session);

      return new DataSuccess(paymentRequest.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, {error: err}));
    }
  }
}
