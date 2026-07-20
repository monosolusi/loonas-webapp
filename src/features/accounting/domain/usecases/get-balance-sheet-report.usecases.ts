import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ReportRepository } from "@/features/accounting/domain/repositories/report";
import { BalanceSheetReportEntity } from "@/features/accounting/domain/entities/balance-sheet";

export type GetBalanceSheetReportUseCaseResult = BalanceSheetReportEntity;

export type GetBalanceSheetReportUseCaseParams = {
  readonly asOf: string;
  readonly compareTo?: string;
};

export class GetBalanceSheetReportUseCase
  implements UseCase<DataState<GetBalanceSheetReportUseCaseResult>, GetBalanceSheetReportUseCaseParams>
{
  constructor(
    private readonly repo: ReportRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: GetBalanceSheetReportUseCaseParams): Promise<DataState<GetBalanceSheetReportUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      return await this.fetchReport(params, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async fetchReport(
    params: GetBalanceSheetReportUseCaseParams,
    session: SessionEntity,
  ): Promise<DataState<GetBalanceSheetReportUseCaseResult>> {
    return this.repo.getBalanceSheet({ asOf: params.asOf, compareTo: params.compareTo }, session);
  }
}
