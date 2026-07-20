import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class DeleteOutgoingInvoiceUseCaseParams {
  public readonly invoice: { id: string };

  constructor(args: { invoice: { id: string } }) {
    this.invoice = args.invoice;
    Object.freeze(this);
  }
}

export class DeleteOutgoingInvoiceUseCase implements UseCase<DataState<boolean>, DeleteOutgoingInvoiceUseCaseParams> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: DeleteOutgoingInvoiceUseCaseParams): Promise<DataState<boolean>> {
    try {
      const session = await this.resolveSession();
      return this.invoiceRepository.deleteOutgoing({ id: params.invoice.id }, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
