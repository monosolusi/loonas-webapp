import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { CombinedInvoiceSummaryEntity } from "@/features/invoice/domain/entities/combined-invoice-summary";

export class ListCombinedInvoiceSummaryUseCase implements UseCase<DataState<CombinedInvoiceSummaryEntity[]>, void> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: void): Promise<DataState<CombinedInvoiceSummaryEntity[]>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const invoices = await this.invoiceRepository.listCombinedInvoiceSummary(session.data);
      if (invoices instanceof DataFailed) throw invoices.error;
      if (!invoices.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return invoices;
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
