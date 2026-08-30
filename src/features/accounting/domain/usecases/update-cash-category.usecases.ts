import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CashCategoryRepository } from "@/features/accounting/domain/repositories/cash-category";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";

/**
 * Partial update — an omitted field is left unchanged by the server. `direction` is not
 * updatable: a category's direction is fixed at create time, so remapping an account is the
 * only way to change where its entries post.
 */
export class UpdateCashCategoryUseCaseParams {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly accountId?: string,
  ) {}
}

export class UpdateCashCategoryUseCase implements UseCase<
  DataState<CashCategoryEntity>,
  UpdateCashCategoryUseCaseParams
> {
  constructor(
    private readonly repo: CashCategoryRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: UpdateCashCategoryUseCaseParams): Promise<DataState<CashCategoryEntity>> {
    try {
      const session = await this.resolveSession();
      const category = await this.updateCategory(params, session);
      return new DataSuccess(category);
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

  private async updateCategory(
    params: UpdateCashCategoryUseCaseParams,
    session: SessionEntity,
  ): Promise<CashCategoryEntity> {
    const result = await this.repo.update({ id: params.id, name: params.name, accountId: params.accountId }, session);
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
