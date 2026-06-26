import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountRepository, ListLedgerAccountsResult } from "@/features/accounting/domain/repositories/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

type ListLedgerAccountsUseCaseInput = { page?: number; limit?: number; search?: string; types?: AccountType[] };

export class ListLedgerAccountsUseCaseParams {
  constructor(public readonly params: ListLedgerAccountsUseCaseInput) {}
}

export class ListLedgerAccountsUseCase implements UseCase<DataState<ListLedgerAccountsResult>, ListLedgerAccountsUseCaseParams> {
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListLedgerAccountsUseCaseParams): Promise<DataState<ListLedgerAccountsResult>> {
    try {
      const session = await this.sessionRepo.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return this.repo.list(params.params, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
