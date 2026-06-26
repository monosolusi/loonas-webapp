import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountRepository } from "@/features/accounting/domain/repositories/ledger-account";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { PaginationMeta } from "@/core/resources/paginated";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

type ListLedgerAccountsUseCaseInput = { page?: number; limit?: number; search?: string; types?: AccountType[] };

export type ListLedgerAccountsUseCaseResult = { accounts: LedgerAccountEntity[]; meta: PaginationMeta };

export class ListLedgerAccountsUseCaseParams {
  constructor(public readonly params: ListLedgerAccountsUseCaseInput) {}
}

export class ListLedgerAccountsUseCase implements UseCase<DataState<ListLedgerAccountsUseCaseResult>, ListLedgerAccountsUseCaseParams> {
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListLedgerAccountsUseCaseParams): Promise<DataState<ListLedgerAccountsUseCaseResult>> {
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
