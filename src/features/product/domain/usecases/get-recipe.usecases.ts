import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { RecipeItemEntity } from "@/features/product/domain/entities/recipe-item";
import { ProductRepository } from "@/features/product/domain/repositories/product";

export class GetRecipeUseCaseParams {
  constructor(
    public readonly productId: string,
    public readonly variantId: string,
  ) {}
}

export class GetRecipeUseCase implements UseCase<DataState<RecipeItemEntity[]>, GetRecipeUseCaseParams> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetRecipeUseCaseParams): Promise<DataState<RecipeItemEntity[]>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.productRepository.getRecipe(params.productId, params.variantId, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
