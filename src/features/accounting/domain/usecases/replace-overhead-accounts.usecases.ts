import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { OverheadAccountSelectionEntity } from "@/features/accounting/domain/entities/overhead-account-selection";
import { OverheadAccountRepository } from "@/features/accounting/domain/repositories/overhead-account";

export class ReplaceOverheadAccountsUseCaseParams {
  constructor(public readonly accountIds: string[]) {}
}

export class ReplaceOverheadAccountsUseCase
  implements UseCase<DataState<OverheadAccountSelectionEntity[]>, ReplaceOverheadAccountsUseCaseParams>
{
  constructor(
    private readonly repo: OverheadAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ReplaceOverheadAccountsUseCaseParams): Promise<DataState<OverheadAccountSelectionEntity[]>> {
    try {
      const session = await this.resolveSession();
      return await this.replaceSelections(params, session);
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

  private async replaceSelections(
    params: ReplaceOverheadAccountsUseCaseParams,
    session: SessionEntity,
  ): Promise<DataState<OverheadAccountSelectionEntity[]>> {
    return this.repo.replace({ accountIds: params.accountIds }, session);
  }
}
