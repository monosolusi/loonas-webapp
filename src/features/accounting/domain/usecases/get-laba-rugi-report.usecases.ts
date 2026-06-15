import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ReportRepository, LabaRugiReportData } from "@/features/accounting/domain/repositories/report";

export type GetLabaRugiReportUseCaseParams = {
  readonly from: string;
  readonly to: string;
  readonly compareFrom?: string;
  readonly compareTo?: string;
};

export class GetLabaRugiReportUseCase implements UseCase<DataState<LabaRugiReportData>, GetLabaRugiReportUseCaseParams> {
  constructor(
    private readonly repo: ReportRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: GetLabaRugiReportUseCaseParams): Promise<DataState<LabaRugiReportData>> {
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
    params: GetLabaRugiReportUseCaseParams,
    session: SessionEntity,
  ): Promise<DataState<LabaRugiReportData>> {
    return this.repo.getLabaRugi(
      { from: params.from, to: params.to, compareFrom: params.compareFrom, compareTo: params.compareTo },
      session,
    );
  }
}
