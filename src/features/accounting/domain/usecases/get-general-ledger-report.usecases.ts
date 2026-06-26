import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ReportRepository } from "@/features/accounting/domain/repositories/report";
import { GeneralLedgerReportEntity } from "@/features/accounting/domain/entities/general-ledger";
import { PaginationMeta } from "@/core/resources/paginated";

export type GetGeneralLedgerReportUseCaseResult = {
  readonly data: GeneralLedgerReportEntity;
  readonly meta: PaginationMeta;
};

export type GetGeneralLedgerReportUseCaseParams = {
  readonly accountId: string;
  readonly from: string;
  readonly to: string;
  readonly page?: number;
  readonly limit?: number;
};

export class GetGeneralLedgerReportUseCase
  implements UseCase<DataState<GetGeneralLedgerReportUseCaseResult>, GetGeneralLedgerReportUseCaseParams>
{
  constructor(
    private readonly repo: ReportRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: GetGeneralLedgerReportUseCaseParams): Promise<DataState<GetGeneralLedgerReportUseCaseResult>> {
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
    params: GetGeneralLedgerReportUseCaseParams,
    session: SessionEntity,
  ): Promise<DataState<GetGeneralLedgerReportUseCaseResult>> {
    return this.repo.getGeneralLedger(
      {
        accountId: params.accountId,
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      },
      session,
    );
  }
}
