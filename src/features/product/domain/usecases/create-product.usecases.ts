import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { ProductRepository, CreateProductParams } from "@/features/product/domain/repositories/product";

export class CreateProductUseCaseParams {
  constructor(public readonly params: CreateProductParams) {}
}

export class CreateProductUseCase implements UseCase<DataState<ProductEntity>, CreateProductUseCaseParams> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreateProductUseCaseParams): Promise<DataState<ProductEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.productRepository.create(params.params, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
