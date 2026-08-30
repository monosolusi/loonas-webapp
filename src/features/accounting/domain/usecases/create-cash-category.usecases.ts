import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CashCategoryRepository } from "@/features/accounting/domain/repositories/cash-category";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

export class CreateCashCategoryUseCaseParams {
  constructor(
    public readonly name: string,
    public readonly accountId: string,
    public readonly direction: CashEntryDirection,
  ) {}
}

export class CreateCashCategoryUseCase implements UseCase<
  DataState<CashCategoryEntity>,
  CreateCashCategoryUseCaseParams
> {
  constructor(
    private readonly repo: CashCategoryRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: CreateCashCategoryUseCaseParams): Promise<DataState<CashCategoryEntity>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.createCategory(params, session));
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

  private async createCategory(
    params: CreateCashCategoryUseCaseParams,
    session: SessionEntity,
  ): Promise<CashCategoryEntity> {
    const result = await this.repo.create(
      { name: params.name, accountId: params.accountId, direction: params.direction },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
