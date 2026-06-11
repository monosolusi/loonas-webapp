import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ProductRepository } from "@/features/product/domain/repositories/product";

export class DeleteProductUseCaseParams {
  constructor(public readonly id: string) {}
}

export class DeleteProductUseCase implements UseCase<DataState<void>, DeleteProductUseCaseParams> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: DeleteProductUseCaseParams): Promise<DataState<void>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.productRepository.delete(params.id, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
