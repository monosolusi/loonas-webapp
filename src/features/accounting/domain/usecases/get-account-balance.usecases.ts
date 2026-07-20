import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountRepository } from "@/features/accounting/domain/repositories/ledger-account";
import { AccountBalanceEntity } from "@/features/accounting/domain/entities/account-balance";

export type GetAccountBalanceUseCaseParams = {
  readonly accountId: string;
  readonly startDate?: string;
  readonly endDate?: string;
};

export class GetAccountBalanceUseCase implements UseCase<DataState<AccountBalanceEntity>, GetAccountBalanceUseCaseParams> {
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: GetAccountBalanceUseCaseParams): Promise<DataState<AccountBalanceEntity>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.fetchBalance(params, session));
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

  private async fetchBalance(params: GetAccountBalanceUseCaseParams, session: SessionEntity): Promise<AccountBalanceEntity> {
    const result = await this.repo.getBalance(
      { accountId: params.accountId, startDate: params.startDate, endDate: params.endDate },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
