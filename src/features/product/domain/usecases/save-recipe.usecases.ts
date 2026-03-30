import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ProductRepository, SaveRecipeParams } from "@/features/product/domain/repositories/product";

export class SaveRecipeUseCaseParams {
  constructor(
    public readonly productId: string,
    public readonly variantId: string,
    public readonly params: SaveRecipeParams,
  ) {}
}

export class SaveRecipeUseCase implements UseCase<DataState<void>, SaveRecipeUseCaseParams> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: SaveRecipeUseCaseParams): Promise<DataState<void>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.productRepository.saveRecipe(params.productId, params.variantId, params.params, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
