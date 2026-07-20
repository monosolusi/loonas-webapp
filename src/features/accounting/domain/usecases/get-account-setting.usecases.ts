import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { AccountSettingRepository } from "@/features/accounting/domain/repositories/account-setting";
import { AccountSettingEntity } from "@/features/accounting/domain/entities/account-setting";

export class GetAccountSettingUseCase implements UseCase<DataState<AccountSettingEntity>> {
  constructor(
    private readonly repo: AccountSettingRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<AccountSettingEntity>> {
    try {
      const session = await this.resolveSession();
      return this.repo.get(session);
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
