import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountRepository } from "@/features/accounting/domain/repositories/ledger-account";
import { LedgerEntryEntity } from "@/features/accounting/domain/entities/ledger-entry";
import { PaginationMeta } from "@/core/resources/paginated";

export type ListLedgerEntriesUseCaseResult = { entries: LedgerEntryEntity[]; meta: PaginationMeta };

export type ListLedgerEntriesUseCaseParams = {
  readonly accountId: string;
  readonly page?: number;
  readonly limit?: number;
  readonly startDate?: string;
  readonly endDate?: string;
};

export class ListLedgerEntriesUseCase implements UseCase<DataState<ListLedgerEntriesUseCaseResult>, ListLedgerEntriesUseCaseParams> {
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListLedgerEntriesUseCaseParams): Promise<DataState<ListLedgerEntriesUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.fetchEntries(params, session));
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

  private async fetchEntries(params: ListLedgerEntriesUseCaseParams, session: SessionEntity): Promise<ListLedgerEntriesUseCaseResult> {
    const result = await this.repo.listEntries(
      { accountId: params.accountId, page: params.page, limit: params.limit, startDate: params.startDate, endDate: params.endDate },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
