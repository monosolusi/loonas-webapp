import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { FixedCostEntryRepository, ListFixedCostEntryResult } from "@/features/fixed-cost/domain/repositories/fixed-cost-entry";

export class ListFixedCostEntriesUseCaseParams {
  constructor(
    public readonly fixedCostId: string,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}

export class ListFixedCostEntriesUseCase implements UseCase<DataState<ListFixedCostEntryResult>, ListFixedCostEntriesUseCaseParams> {
  constructor(
    private readonly fixedCostEntryRepository: FixedCostEntryRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListFixedCostEntriesUseCaseParams): Promise<DataState<ListFixedCostEntryResult>> {
    try {
      const session = await this.resolveSession();
      return this.listEntries(params, session);
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

  private async listEntries(params: ListFixedCostEntriesUseCaseParams, session: SessionEntity): Promise<DataState<ListFixedCostEntryResult>> {
    return this.fixedCostEntryRepository.list(
      { fixedCostId: params.fixedCostId, page: params.page, limit: params.limit },
      session,
    );
  }
}
