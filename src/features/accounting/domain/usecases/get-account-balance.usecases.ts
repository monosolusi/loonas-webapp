import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountRepository, GetAccountBalanceParams } from "@/features/accounting/domain/repositories/ledger-account";
import { AccountBalanceEntity } from "@/features/accounting/domain/entities/account-balance";

export class GetAccountBalanceUseCaseParams {
  constructor(
    public readonly accountId: string,
    public readonly params: GetAccountBalanceParams,
  ) {}
}

export class GetAccountBalanceUseCase implements UseCase<DataState<AccountBalanceEntity>, GetAccountBalanceUseCaseParams> {
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: GetAccountBalanceUseCaseParams): Promise<DataState<AccountBalanceEntity>> {
    try {
      const session = await this.sessionRepo.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return this.repo.getBalance(params.accountId, params.params, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
