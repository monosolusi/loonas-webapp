import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryRepository } from "@/features/accounting/domain/repositories/cash-entry";

/**
 * `idempotencyKey` is required by the API on cancel — mint it in the app-layer handler that
 * owns form state and thread it through unchanged, same rule as create.
 */
export class CancelCashEntryUseCaseParams {
  constructor(
    public readonly id: string,
    public readonly idempotencyKey: string,
    public readonly note?: string | null,
  ) {}
}

/**
 * Cancelling an entry returns the newly created CANCELLATION entry (`status: "cancellation"`,
 * `cancelsId` set to the original entry's id) — never the original entry. The original's own
 * `status` becomes `"cancelled"` server-side but is not what this use case returns; a caller
 * that needs the original's updated state must refetch it.
 */
export class CancelCashEntryUseCase implements UseCase<DataState<CashEntryEntity>, CancelCashEntryUseCaseParams> {
  constructor(
    private readonly repo: CashEntryRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: CancelCashEntryUseCaseParams): Promise<DataState<CashEntryEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.repo.cancel(
        {
          id: params.id,
          idempotencyKey: params.idempotencyKey,
          note: params.note,
        },
        session,
      );
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
}
