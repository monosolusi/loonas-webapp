import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { LedgerAccountRepository } from "@/features/accounting/domain/repositories/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

export class UpdateLedgerAccountUseCaseParams {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly code: string | undefined,
    public readonly type: AccountType | undefined,
    // undefined = omit (unchanged), null = clear parent, { id } = set new parent
    public readonly parent: { id: string } | null | undefined,
  ) {}
}

export class UpdateLedgerAccountUseCase
  implements UseCase<DataState<LedgerAccountEntity>, UpdateLedgerAccountUseCaseParams>
{
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: UpdateLedgerAccountUseCaseParams): Promise<DataState<LedgerAccountEntity>> {
    try {
      const session = await this.resolveSession();
      const data = await this.updateAccount(params, session);
      return new DataSuccess(data);
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

  private async updateAccount(
    params: UpdateLedgerAccountUseCaseParams,
    session: SessionEntity,
  ): Promise<LedgerAccountEntity> {
    const result = await this.repo.update(
      {
        id: params.id,
        name: params.name,
        code: params.code,
        type: params.type,
        parent: params.parent,
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    return result.data!;
  }
}
