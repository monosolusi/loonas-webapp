import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { PphFinalSettleRepository } from "@/features/accounting/domain/repositories/pph-final-settle";

export class SettlePphFinalUseCaseParams {
  constructor(
    public readonly cashAccountId: string,
    public readonly amount: number,
    public readonly journalDate: string,
    public readonly memo: string | undefined,
    public readonly idempotencyKey?: string,
  ) {}
}

export type SettlePphFinalResult = JournalEntity;

export class SettlePphFinalUseCase
  implements UseCase<DataState<SettlePphFinalResult>, SettlePphFinalUseCaseParams>
{
  constructor(
    private readonly repo: PphFinalSettleRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: SettlePphFinalUseCaseParams): Promise<DataState<SettlePphFinalResult>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.doSettle(params, session));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async doSettle(
    params: SettlePphFinalUseCaseParams,
    session: SessionEntity,
  ): Promise<SettlePphFinalResult> {
    const result = await this.repo.settle(
      {
        cashAccountId: params.cashAccountId,
        amount: params.amount,
        journalDate: params.journalDate,
        memo: params.memo,
        idempotencyKey: params.idempotencyKey ?? crypto.randomUUID(),
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
