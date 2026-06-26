import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ReportRepository } from "@/features/accounting/domain/repositories/report";
import { TrialBalanceLineEntity } from "@/features/accounting/domain/entities/trial-balance-line";
import { PaginationMeta } from "@/core/resources/paginated";

export type ListTrialBalanceLinesUseCaseResult = {
  readonly lines: TrialBalanceLineEntity[];
  readonly counterparts: TrialBalanceLineEntity[];
  readonly meta: PaginationMeta;
};

export type ListTrialBalanceLinesUseCaseParams = {
  readonly accountId: string;
  readonly from?: string;
  readonly to?: string;
  readonly page?: number;
  readonly limit?: number;
};

export class ListTrialBalanceLinesUseCase
  implements UseCase<DataState<ListTrialBalanceLinesUseCaseResult>, ListTrialBalanceLinesUseCaseParams>
{
  constructor(
    private readonly repo: ReportRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(
    params: ListTrialBalanceLinesUseCaseParams,
  ): Promise<DataState<ListTrialBalanceLinesUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      return await this.fetchLines(params, session);
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

  private async fetchLines(
    params: ListTrialBalanceLinesUseCaseParams,
    session: SessionEntity,
  ): Promise<DataState<ListTrialBalanceLinesUseCaseResult>> {
    return this.repo.listTrialBalanceLines(
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
