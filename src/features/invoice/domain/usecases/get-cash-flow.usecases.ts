import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { CashFlowEntity } from "@/features/invoice/domain/entities/cash-flow";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";

export class GetCashFlowUseCaseParams {
  public month?: number;
  public year?: number;

  constructor(args: { month?: number; year?: number }) {
    this.month = args.month;
    this.year = args.year;
  }
}

export class GetCashFlowUseCase implements UseCase<DataState<CashFlowEntity>, GetCashFlowUseCaseParams> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetCashFlowUseCaseParams): Promise<DataState<CashFlowEntity>> {
    try {
      const session = await this.retrieveSession();
      return this.invoiceRepository.getCashFlow({ month: params.month, year: params.year }, session);
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
