import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ReportRepository } from "@/features/accounting/domain/repositories/report";
import { IncomeStatementReportEntity } from "@/features/accounting/domain/entities/income-statement";

export type GetIncomeStatementReportUseCaseResult = IncomeStatementReportEntity;

export type GetIncomeStatementReportUseCaseParams = {
  readonly from: string;
  readonly to: string;
  readonly compareFrom?: string;
  readonly compareTo?: string;
};

export class GetIncomeStatementReportUseCase
  implements UseCase<DataState<GetIncomeStatementReportUseCaseResult>, GetIncomeStatementReportUseCaseParams>
{
  constructor(
    private readonly repo: ReportRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(
    params: GetIncomeStatementReportUseCaseParams,
  ): Promise<DataState<GetIncomeStatementReportUseCaseResult>> {
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
    params: GetIncomeStatementReportUseCaseParams,
    session: SessionEntity,
  ): Promise<DataState<GetIncomeStatementReportUseCaseResult>> {
    return this.repo.getIncomeStatement(
      { from: params.from, to: params.to, compareFrom: params.compareFrom, compareTo: params.compareTo },
      session,
    );
  }
}
