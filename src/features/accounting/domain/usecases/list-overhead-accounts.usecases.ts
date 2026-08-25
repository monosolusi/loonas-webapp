import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { OverheadAccountSelectionEntity } from "@/features/accounting/domain/entities/overhead-account-selection";
import { OverheadAccountRepository } from "@/features/accounting/domain/repositories/overhead-account";

export class ListOverheadAccountsUseCase implements UseCase<DataState<OverheadAccountSelectionEntity[]>> {
  constructor(
    private readonly repo: OverheadAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<OverheadAccountSelectionEntity[]>> {
    try {
      const session = await this.resolveSession();
      return await this.fetchSelections(session);
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

  private async fetchSelections(session: SessionEntity): Promise<DataState<OverheadAccountSelectionEntity[]>> {
    return this.repo.list(session);
  }
}
