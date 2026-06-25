import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountRepository } from "@/features/accounting/domain/repositories/ledger-account";

export class DeleteLedgerAccountUseCaseParams {
  constructor(public readonly id: string) {}
}

export class DeleteLedgerAccountUseCase implements UseCase<DataState<void>, DeleteLedgerAccountUseCaseParams> {
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: DeleteLedgerAccountUseCaseParams): Promise<DataState<void>> {
    try {
      const session = await this.resolveSession();
      await this.deleteAccount(params, session);
      return new DataSuccess(undefined);
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

  private async deleteAccount(params: DeleteLedgerAccountUseCaseParams, session: SessionEntity): Promise<void> {
    const result = await this.repo.delete({ id: params.id }, session);
    if (result instanceof DataFailed) throw result.error;
  }
}
