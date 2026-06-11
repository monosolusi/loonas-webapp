import { DataFailed, DataState } from "@/core/resources/data-state";
import { UseCase } from "@/core/resources/use-case";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PublicOutgoingInvoiceEntity } from "@/features/invoice/domain/entities/public-outgoing-invoice";

export class GetPublicOutgoingInvoiceUseCaseParams {
  public readonly invoiceId: string;

  constructor(props: { invoiceId: string }) {
    this.invoiceId = props.invoiceId;
  }
}

export class GetPublicOutgoingInvoiceUseCase
  implements UseCase<DataState<PublicOutgoingInvoiceEntity>, GetPublicOutgoingInvoiceUseCaseParams>
{
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  public async execute(params: GetPublicOutgoingInvoiceUseCaseParams): Promise<DataState<PublicOutgoingInvoiceEntity>> {
    try {
      return this.invoiceRepository.getPublicOutgoing({ invoiceId: params.invoiceId });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
