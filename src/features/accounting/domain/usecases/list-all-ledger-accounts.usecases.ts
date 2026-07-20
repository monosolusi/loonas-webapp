import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountRepository } from "@/features/accounting/domain/repositories/ledger-account";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

// Backend caps GET /accounting/accounts `limit` at 100 (OpenAPI: maximum: 100). To load the
// entire chart-of-accounts for client-side comboboxes we page through at the max page size.
const LEDGER_ACCOUNT_PAGE_LIMIT = 100;

export type ListAllLedgerAccountsUseCaseResult = { accounts: LedgerAccountEntity[] };

export type ListAllLedgerAccountsUseCaseParams = {
  readonly search?: string;
  readonly types?: AccountType[];
};

export class ListAllLedgerAccountsUseCase
  implements UseCase<DataState<ListAllLedgerAccountsUseCaseResult>, ListAllLedgerAccountsUseCaseParams>
{
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListAllLedgerAccountsUseCaseParams = {}): Promise<DataState<ListAllLedgerAccountsUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.fetchAllAccounts(params, session));
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

  private async fetchAllAccounts(
    params: ListAllLedgerAccountsUseCaseParams,
    session: SessionEntity,
  ): Promise<ListAllLedgerAccountsUseCaseResult> {
    const first = await this.fetchPage(params, 1, session);
    const totalPages = first.meta.totalPages;

    if (totalPages <= 1) return { accounts: first.accounts };

    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) => this.fetchPage(params, i + 2, session)),
    );

    return { accounts: rest.reduce((acc, page) => acc.concat(page.accounts), first.accounts) };
  }

  private async fetchPage(params: ListAllLedgerAccountsUseCaseParams, page: number, session: SessionEntity) {
    const result = await this.repo.list(
      { page, limit: LEDGER_ACCOUNT_PAGE_LIMIT, search: params.search, types: params.types },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
