import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";

export class GetInvoiceUseCaseParams {
  public id: string;
  public includes?: string;

  constructor(args: { id: string, includes?: string }) {
    this.id = args.id;
    this.includes = args.includes;
  }
}

export class GetInvoiceUseCase implements UseCase<DataState<InvoiceEntity>, GetInvoiceUseCaseParams> {

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: GetInvoiceUseCaseParams): Promise<DataState<InvoiceEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const invoice = await this.invoiceRepository.get({ id: params.id }, { includes: params.includes }, session.data);
      if (invoice instanceof DataFailed) return invoice;
      if (!invoice.data) throw new ServerError(ErrorCodes.NOT_FOUND);
      return new DataSuccess(invoice.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
