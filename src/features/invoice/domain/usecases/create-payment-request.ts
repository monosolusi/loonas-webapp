import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";
import { DateTime } from "luxon";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaymentRequestEntity } from "@/features/invoice/domain/entities/payment-request";
import { PaymentRequestRepository } from "@/features/invoice/domain/repositories/payment-request";

interface InvoiceDocument {
  file: File;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
}

interface CreatePaymentRequestUseCaseParamsConstructor {
  receiver: PartnerEntity;
  bankAccount: BankAccountEntity;
  invoices: InvoiceDocument[];
  paymentMethod: PaymentGatewayEntity;
  paymentScheme?: PaymentSchemeEntity;
}

export class CreatePaymentRequestUseCaseParams {
  public receiver: PartnerEntity;
  public bankAccount: BankAccountEntity;
  public invoices: InvoiceDocument[];
  public paymentMethod: PaymentGatewayEntity;
  public paymentScheme?: PaymentSchemeEntity;

  constructor(args: CreatePaymentRequestUseCaseParamsConstructor) {
    this.receiver = args.receiver;
    this.bankAccount = args.bankAccount;
    this.invoices = args.invoices;
    this.paymentMethod = args.paymentMethod;
    this.paymentScheme = args.paymentScheme;
  }
}

export class CreatePaymentRequestUseCase implements UseCase<DataState<PaymentRequestEntity>, CreatePaymentRequestUseCaseParams> {

  constructor(
    private readonly paymentRequestRepository: PaymentRequestRepository,
    private readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: CreatePaymentRequestUseCaseParams): Promise<DataState<PaymentRequestEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.paymentRequestRepository.create({
        receiver: params.receiver,
        bankAccount: params.bankAccount,
        invoices: params.invoices,
        paymentMethod: params.paymentMethod,
        paymentScheme: params.paymentScheme
      }, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

}