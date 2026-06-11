import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import {
  ListProductsForSaleResult,
  ProductRepository,
} from "@/features/product/domain/repositories/product";

export class ListProductsForSaleUseCaseParams {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
    public readonly categoryIds?: string[],
    public readonly search?: string,
  ) {}
}

export class ListProductsForSaleUseCase
  implements UseCase<DataState<ListProductsForSaleResult>, ListProductsForSaleUseCaseParams>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListProductsForSaleUseCaseParams): Promise<DataState<ListProductsForSaleResult>> {
    try {
      const session = await this.resolveSession();
      const result = await this.listProducts(params, session);
      return new DataSuccess(result);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async listProducts(
    params: ListProductsForSaleUseCaseParams,
    session: SessionEntity,
  ): Promise<ListProductsForSaleResult> {
    const result = await this.productRepository.listForSale(
      {
        page: params.page,
        limit: params.limit,
        categoryIds: params.categoryIds,
        search: params.search,
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
