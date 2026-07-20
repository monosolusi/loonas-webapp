import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { JournalRepository } from "@/features/accounting/domain/repositories/journal";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { PaginationMeta } from "@/core/resources/paginated";

export type ListJournalsUseCaseResult = { journals: JournalEntity[]; meta: PaginationMeta };

export type ListJournalsUseCaseParams = {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly dateFrom?: string;
  readonly dateTo?: string;
};

export class ListJournalsUseCase implements UseCase<DataState<ListJournalsUseCaseResult>, ListJournalsUseCaseParams> {
  constructor(
    private readonly repo: JournalRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListJournalsUseCaseParams): Promise<DataState<ListJournalsUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.fetchJournals(params, session));
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

  private async fetchJournals(params: ListJournalsUseCaseParams, session: SessionEntity): Promise<ListJournalsUseCaseResult> {
    const result = await this.repo.list(
      { page: params.page, limit: params.limit, search: params.search, dateFrom: params.dateFrom, dateTo: params.dateTo },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
