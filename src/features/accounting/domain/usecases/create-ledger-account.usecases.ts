import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { LedgerAccountRepository } from "@/features/accounting/domain/repositories/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

export class CreateLedgerAccountUseCaseParams {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly type: AccountType,
    public readonly parentId: string | undefined,
  ) {}
}

export class CreateLedgerAccountUseCase
  implements UseCase<DataState<LedgerAccountEntity>, CreateLedgerAccountUseCaseParams>
{
  constructor(
    private readonly repo: LedgerAccountRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: CreateLedgerAccountUseCaseParams): Promise<DataState<LedgerAccountEntity>> {
    try {
      const session = await this.resolveSession();
      // Generate idempotency key once per attempt — threading through to service layer
      const idempotencyKey = crypto.randomUUID();
      const data = await this.createAccount(params, idempotencyKey, session);
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

  private async createAccount(
    params: CreateLedgerAccountUseCaseParams,
    idempotencyKey: string,
    session: SessionEntity,
  ): Promise<LedgerAccountEntity> {
    const result = await this.repo.create(
      {
        code: params.code,
        name: params.name,
        type: params.type,
        parentId: params.parentId,
        idempotencyKey,
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    return result.data!;
  }
}
