import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountRepository } from "@/features/accounting/domain/repositories/ledger-account";
import { LedgerEntryEntity } from "@/features/accounting/domain/entities/ledger-entry";
import { PaginationMeta } from "@/core/resources/paginated";

type ListLedgerEntriesUseCaseInput = { page?: number; limit?: number; startDate?: string; endDate?: string };

export type ListLedgerEntriesUseCaseResult = { entries: LedgerEntryEntity[]; meta: PaginationMeta };

export class ListLedgerEntriesUseCaseParams {
  constructor(
    public readonly accountId: string,
    public readonly params: ListLedgerEntriesUseCaseInput,
  ) {}
}

export class ListLedgerEntriesUseCase implements UseCase<DataState<ListLedgerEntriesUseCaseResult>, ListLedgerEntriesUseCaseParams> {
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListLedgerEntriesUseCaseParams): Promise<DataState<ListLedgerEntriesUseCaseResult>> {
    try {
      const session = await this.sessionRepo.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return this.repo.listEntries(params.accountId, params.params, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
