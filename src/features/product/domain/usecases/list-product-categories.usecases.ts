import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { ProductCategoryRepository } from "@/features/product/domain/repositories/product-category";

export class ListProductCategoriesUseCaseParams {
  constructor(public readonly search?: string) {}
}

export class ListProductCategoriesUseCase
  implements UseCase<DataState<ProductCategoryEntity[]>, ListProductCategoriesUseCaseParams>
{
  constructor(
    private readonly categoryRepository: ProductCategoryRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params?: ListProductCategoriesUseCaseParams): Promise<DataState<ProductCategoryEntity[]>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.categoryRepository.list(params?.search, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
