import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CashCategoryRepository } from "@/features/accounting/domain/repositories/cash-category";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { PaginationMeta } from "@/core/resources/paginated";

export type ListCashCategoriesUseCaseResult = {
  readonly categories: CashCategoryEntity[];
  readonly meta: PaginationMeta;
};

export type ListCashCategoriesUseCaseParams = {
  readonly direction?: CashEntryDirection;
};

export class ListCashCategoriesUseCase implements UseCase<
  DataState<ListCashCategoriesUseCaseResult>,
  ListCashCategoriesUseCaseParams
> {
  constructor(
    private readonly repo: CashCategoryRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListCashCategoriesUseCaseParams): Promise<DataState<ListCashCategoriesUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      const categories = await this.fetchCategories(params, session);
      return new DataSuccess(categories);
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

  private async fetchCategories(
    params: ListCashCategoriesUseCaseParams,
    session: SessionEntity,
  ): Promise<ListCashCategoriesUseCaseResult> {
    const result = await this.repo.list({ direction: params.direction }, session);
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return { categories: result.data.data, meta: result.data.meta };
  }
}
