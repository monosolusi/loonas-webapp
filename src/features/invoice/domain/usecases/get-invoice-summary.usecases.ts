import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { InvoiceSummaryEntity } from "@/features/invoice/domain/entities/invoice-summary";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";

export class GetInvoiceSummaryUseCaseParams {
  public type: InvoiceType;

  constructor(args: { type: InvoiceType }) {
    this.type = args.type;
  }
}

export class GetInvoiceSummaryUseCase
  implements UseCase<DataState<InvoiceSummaryEntity>, GetInvoiceSummaryUseCaseParams>
{
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetInvoiceSummaryUseCaseParams): Promise<DataState<InvoiceSummaryEntity>> {
    try {
      const session = await this.retrieveSession();
      return this.invoiceRepository.getSummary({ type: params.type }, session);
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
