import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CashEntryRepository } from "@/features/accounting/domain/repositories/cash-entry";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { PaginationMeta } from "@/core/resources/paginated";

export type ListCashEntriesUseCaseResult = { entries: CashEntryEntity[]; meta: PaginationMeta };

export type ListCashEntriesUseCaseParams = {
  readonly page?: number;
  readonly limit?: number;
  readonly direction?: CashEntryDirection;
  readonly dateFrom?: string;
  readonly dateTo?: string;
};

export class ListCashEntriesUseCase
  implements UseCase<DataState<ListCashEntriesUseCaseResult>, ListCashEntriesUseCaseParams>
{
  constructor(
    private readonly repo: CashEntryRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListCashEntriesUseCaseParams): Promise<DataState<ListCashEntriesUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.fetchCashEntries(params, session));
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

  private async fetchCashEntries(
    params: ListCashEntriesUseCaseParams,
    session: SessionEntity,
  ): Promise<ListCashEntriesUseCaseResult> {
    const result = await this.repo.list(
      {
        page: params.page,
        limit: params.limit,
        direction: params.direction,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
