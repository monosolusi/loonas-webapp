import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { AccountingPeriodRepository } from "@/features/accounting/domain/repositories/accounting-period";

export class ClosePeriodUseCaseParams {
  constructor(
    public readonly id: string,
    public readonly idempotencyKey: string,
    public readonly reason?: string,
  ) {}
}

export class ClosePeriodUseCase implements UseCase<DataState<AccountingPeriodEntity>, ClosePeriodUseCaseParams> {
  constructor(
    private readonly repo: AccountingPeriodRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ClosePeriodUseCaseParams): Promise<DataState<AccountingPeriodEntity>> {
    try {
      const session = await this.sessionRepo.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return this.repo.close({ id: params.id, idempotencyKey: params.idempotencyKey, reason: params.reason }, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
