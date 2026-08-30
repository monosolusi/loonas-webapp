import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CashEntrySettingsRepository } from "@/features/accounting/domain/repositories/cash-entry-settings";
import { CashEntrySettingsEntity } from "@/features/accounting/domain/entities/cash-entry-settings";

export class GetCashEntrySettingsUseCase implements UseCase<DataState<CashEntrySettingsEntity>> {
  constructor(
    private readonly repo: CashEntrySettingsRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<CashEntrySettingsEntity>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.fetchSettings(session));
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

  private async fetchSettings(session: SessionEntity): Promise<CashEntrySettingsEntity> {
    const result = await this.repo.get(session);
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
