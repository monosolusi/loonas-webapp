import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { FixedCostEntryEntity } from "@/features/fixed-cost/domain/entities/fixed-cost-entry";
import { FixedCostEntryRepository } from "@/features/fixed-cost/domain/repositories/fixed-cost-entry";

export class CreateFixedCostEntryUseCaseParams {
  constructor(
    public readonly fixedCostId: string,
    public readonly amount: number,
    public readonly startDate: string,
    public readonly endDate: string,
  ) {}
}

export class CreateFixedCostEntryUseCase implements UseCase<DataState<FixedCostEntryEntity>, CreateFixedCostEntryUseCaseParams> {
  constructor(
    private readonly fixedCostEntryRepository: FixedCostEntryRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreateFixedCostEntryUseCaseParams): Promise<DataState<FixedCostEntryEntity>> {
    try {
      const session = await this.resolveSession();
      return this.createEntry(params, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async createEntry(params: CreateFixedCostEntryUseCaseParams, session: SessionEntity): Promise<DataState<FixedCostEntryEntity>> {
    return this.fixedCostEntryRepository.create(
      { fixedCostId: params.fixedCostId, amount: params.amount, startDate: params.startDate, endDate: params.endDate },
      session,
    );
  }
}
