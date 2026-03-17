import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { JournalRepository, ListJournalsParams, ListJournalsResult } from "@/features/accounting/domain/repositories/journal";

export class ListJournalsUseCaseParams {
  constructor(public readonly params: ListJournalsParams) {}
}

export class ListJournalsUseCase implements UseCase<DataState<ListJournalsResult>, ListJournalsUseCaseParams> {
  constructor(
    private readonly repo: JournalRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListJournalsUseCaseParams): Promise<DataState<ListJournalsResult>> {
    try {
      const session = await this.sessionRepo.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return this.repo.list(params.params, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
