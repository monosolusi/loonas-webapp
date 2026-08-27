import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { CashEntryRepository } from "@/features/accounting/domain/repositories/cash-entry";

/**
 * `idempotencyKey` is required by the API on create — mint it in the app-layer handler that
 * owns form state (`crypto.randomUUID()`) and thread it through unchanged. Reuse the same key
 * across retries of one logical attempt; only rotate on a definitive 4xx. This use case only
 * threads the key — it does not mint or rotate it.
 */
export class CreateCashEntryUseCaseParams {
  constructor(
    public readonly direction: CashEntryDirection,
    public readonly amount: number,
    public readonly categoryId: string,
    public readonly date: string,
    public readonly idempotencyKey: string,
    public readonly note?: string | null,
  ) {}
}

export class CreateCashEntryUseCase implements UseCase<DataState<CashEntryEntity>, CreateCashEntryUseCaseParams> {
  constructor(
    private readonly repo: CashEntryRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: CreateCashEntryUseCaseParams): Promise<DataState<CashEntryEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.repo.create(
        {
          direction: params.direction,
          amount: params.amount,
          categoryId: params.categoryId,
          date: params.date,
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
