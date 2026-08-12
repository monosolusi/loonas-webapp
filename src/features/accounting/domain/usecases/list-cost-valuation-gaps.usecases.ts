import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ReportRepository } from "@/features/accounting/domain/repositories/report";
import { CostValuationGapRowEntity } from "@/features/accounting/domain/entities/cost-valuation-gap";
import { PaginationMeta } from "@/core/resources/paginated";

export type ListCostValuationGapsUseCaseResult = {
  readonly rows: CostValuationGapRowEntity[];
  readonly meta: PaginationMeta;
};

export type ListCostValuationGapsUseCaseParams = {
  readonly from?: string;
  readonly to?: string;
  readonly page?: number;
  readonly limit?: number;
};

export class ListCostValuationGapsUseCase
  implements UseCase<DataState<ListCostValuationGapsUseCaseResult>, ListCostValuationGapsUseCaseParams>
{
  constructor(
    private readonly repo: ReportRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(
    params: ListCostValuationGapsUseCaseParams,
  ): Promise<DataState<ListCostValuationGapsUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.fetchGaps(params, session));
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

  private async fetchGaps(
    params: ListCostValuationGapsUseCaseParams,
    session: SessionEntity,
  ): Promise<ListCostValuationGapsUseCaseResult> {
    const result = await this.repo.listCostValuationGaps(
      {
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    return { rows: result.data!.rows, meta: result.data!.meta };
  }
}