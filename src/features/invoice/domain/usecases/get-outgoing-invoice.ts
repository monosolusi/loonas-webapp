import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class GetOutgoingInvoiceUseCaseParams {
  public id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
  }
}

export class GetOutgoingInvoiceUseCase
  implements UseCase<DataState<OutgoingInvoiceEntity>, GetOutgoingInvoiceUseCaseParams>
{
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetOutgoingInvoiceUseCaseParams): Promise<DataState<OutgoingInvoiceEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const invoice = await this.invoiceRepository.getOutgoing({ id: params.id }, session.data);
      if (invoice instanceof DataFailed) throw invoice.error;
      if (!invoice.data) throw new ServerError(ErrorCodes.NOT_FOUND);
      return invoice;
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
