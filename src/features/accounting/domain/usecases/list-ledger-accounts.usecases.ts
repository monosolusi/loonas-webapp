import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountRepository } from "@/features/accounting/domain/repositories/ledger-account";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { PaginationMeta } from "@/core/resources/paginated";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

export type ListLedgerAccountsUseCaseResult = { accounts: LedgerAccountEntity[]; meta: PaginationMeta };

export type ListLedgerAccountsUseCaseParams = {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly types?: AccountType[];
  readonly startDate?: string;
  readonly endDate?: string;
};

export class ListLedgerAccountsUseCase implements UseCase<DataState<ListLedgerAccountsUseCaseResult>, ListLedgerAccountsUseCaseParams> {
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListLedgerAccountsUseCaseParams): Promise<DataState<ListLedgerAccountsUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.fetchAccounts(params, session));
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

  private async fetchAccounts(params: ListLedgerAccountsUseCaseParams, session: SessionEntity): Promise<ListLedgerAccountsUseCaseResult> {
    const result = await this.repo.list(
      {
        page: params.page,
        limit: params.limit,
        search: params.search,
        types: params.types,
        startDate: params.startDate,
        endDate: params.endDate,
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
