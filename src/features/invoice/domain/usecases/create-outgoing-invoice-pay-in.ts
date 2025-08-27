import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { UseCase } from "@/core/resources/use-case";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { InvoiceRepository } from "../repositories/invoice";
import { PayInEntity } from "../entities/pay-in";

export class CreateOutgoingInvoicePayInUseCaseParams {
  public invoiceId: string;
  public paymentMethodId: string;
  public paymentSchemeId: string | null;

  constructor(args: { invoiceId: string; paymentMethodId: string; paymentSchemeId?: string | null }) {
    this.invoiceId = args.invoiceId;
    this.paymentMethodId = args.paymentMethodId;
    this.paymentSchemeId = args.paymentSchemeId || null;
  }
}

export class CreateOutgoingInvoicePayInUseCase
  implements UseCase<DataState<PayInEntity>, CreateOutgoingInvoicePayInUseCaseParams>
{
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  public async execute(params: CreateOutgoingInvoicePayInUseCaseParams): Promise<DataState<PayInEntity>> {
    return this.invoiceRepository.createPayInForOutgoingInvoice({
      invoiceId: params.invoiceId,
      paymentMethodId: params.paymentMethodId,
      paymentSchemeId: params.paymentSchemeId,
    });
  }
}
