import { DataFailed, DataState } from "@/core/resources/data-state";
import { UseCase } from "@/core/resources/use-case";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PublicIncomingInvoiceEntity } from "@/features/invoice/domain/entities/public-incoming-invoice";

export class GetPublicIncomingInvoiceUseCaseParams {
  public readonly invoiceId: string;

  constructor(props: { invoiceId: string }) {
    this.invoiceId = props.invoiceId;
  }
}

export class GetPublicIncomingInvoiceUseCase
  implements UseCase<DataState<PublicIncomingInvoiceEntity>, GetPublicIncomingInvoiceUseCaseParams>
{
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  public async execute(
    params: GetPublicIncomingInvoiceUseCaseParams,
  ): Promise<DataState<PublicIncomingInvoiceEntity>> {
    try {
      return this.invoiceRepository.getPublicIncoming({ invoiceId: params.invoiceId });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
