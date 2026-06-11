import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountRepository, ListLedgerEntriesParams, ListLedgerEntriesResult } from "@/features/accounting/domain/repositories/ledger-account";

export class ListLedgerEntriesUseCaseParams {
  constructor(
    public readonly accountId: string,
    public readonly params: ListLedgerEntriesParams,
  ) {}
}

export class ListLedgerEntriesUseCase implements UseCase<DataState<ListLedgerEntriesResult>, ListLedgerEntriesUseCaseParams> {
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListLedgerEntriesUseCaseParams): Promise<DataState<ListLedgerEntriesResult>> {
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
