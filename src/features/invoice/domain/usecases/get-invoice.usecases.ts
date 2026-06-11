import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { InvoiceDetailEntity } from "@/features/invoice/domain/types/invoice-detail";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";

export class GetInvoiceUseCaseParams {
  public id: string;
  public includes?: string;

  constructor(args: { id: string; includes?: string }) {
    this.id = args.id;
    this.includes = args.includes;
  }
}

export class GetInvoiceUseCase implements UseCase<DataState<InvoiceDetailEntity>, GetInvoiceUseCaseParams> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetInvoiceUseCaseParams): Promise<DataState<InvoiceDetailEntity>> {
    try {
      const session = await this.retrieveSession();
      return this.invoiceRepository.get({ id: params.id }, { includes: params.includes }, session);
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
