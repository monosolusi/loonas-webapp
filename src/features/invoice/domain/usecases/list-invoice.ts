import {UseCase} from "@/core/resources/use-case";
import {DataFailed, DataState, DataSuccess} from "@/core/resources/data-state";
import {InvoiceEntity} from "@/features/invoice/domain/entities/invoice";
import {ErrorCodes, ServerError} from "@/core/resources/server-error";
import {SessionRepository} from "@/features/authentication/domain/repositories/session";
import {InvoiceRepository} from "@/features/invoice/domain/repositories/invoice";

export class ListInvoiceUseCase implements UseCase<DataState<InvoiceEntity[]>, void> {

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {
  }

  public async execute(params: void): Promise<DataState<InvoiceEntity[]>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const invoices = await this.invoiceRepository.list({}, session.data);
      if (invoices instanceof DataFailed) return invoices;
      if (!invoices.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (invoices.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);
      return new DataSuccess(invoices.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, {error: err}));
    }
  }
}
