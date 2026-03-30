import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { FixedCostEntryRepository, ListFixedCostEntryByDateResult } from "@/features/fixed-cost/domain/repositories/fixed-cost-entry";

export class ListFixedCostEntriesByDateUseCaseParams {
  constructor(
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}

export class ListFixedCostEntriesByDateUseCase implements UseCase<DataState<ListFixedCostEntryByDateResult>, ListFixedCostEntriesByDateUseCaseParams> {
  constructor(
    private readonly fixedCostEntryRepository: FixedCostEntryRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListFixedCostEntriesByDateUseCaseParams): Promise<DataState<ListFixedCostEntryByDateResult>> {
    try {
      const session = await this.resolveSession();
      return this.listByDate(params, session);
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

  private async listByDate(params: ListFixedCostEntriesByDateUseCaseParams, session: SessionEntity): Promise<DataState<ListFixedCostEntryByDateResult>> {
    return this.fixedCostEntryRepository.listByDate(
      { startDate: params.startDate, endDate: params.endDate, page: params.page, limit: params.limit },
      session,
    );
  }
}
