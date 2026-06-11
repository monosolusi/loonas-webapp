import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { InvoiceTimelineEntity } from "@/features/invoice/domain/entities/invoice-timeline";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";

export class GetInvoiceTimelineUseCaseParams {
  public id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
  }
}

export class GetInvoiceTimelineUseCase
  implements UseCase<DataState<InvoiceTimelineEntity>, GetInvoiceTimelineUseCaseParams>
{
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetInvoiceTimelineUseCaseParams): Promise<DataState<InvoiceTimelineEntity>> {
    try {
      const session = await this.retrieveSession();
      return this.invoiceRepository.getTimeline({ id: params.id }, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async retrieveSession() {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return session.data;
  }
}
