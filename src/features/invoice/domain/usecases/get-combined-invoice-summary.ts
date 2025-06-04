import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { CombinedInvoiceSummaryEntity } from "@/features/invoice/domain/entities/combined-invoice-summary";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class GetCombinedInvoiceSummaryUseCaseParams {
  public id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
  }
}

export class GetCombinedInvoiceSummaryUseCase
  implements UseCase<DataState<CombinedInvoiceSummaryEntity>, GetCombinedInvoiceSummaryUseCaseParams>
{
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(
    params: GetCombinedInvoiceSummaryUseCaseParams,
  ): Promise<DataState<CombinedInvoiceSummaryEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const invoice = await this.invoiceRepository.getCombinedInvoiceSummary({ id: params.id }, session.data);
      if (invoice instanceof DataFailed) return invoice;
      if (!invoice.data) throw new ServerError(ErrorCodes.NOT_FOUND);
      return invoice;
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
