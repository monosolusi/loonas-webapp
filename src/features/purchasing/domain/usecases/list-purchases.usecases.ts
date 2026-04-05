import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaginatedData } from "@/core/resources/paginated";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";
import { PurchaseRepository } from "@/features/purchasing/domain/repositories/purchase";

type ListPurchasesInput = {
  page?: number;
  limit?: number;
};

export class ListPurchasesUseCaseParams {
  constructor(public readonly params: ListPurchasesInput) {}
}

export class ListPurchasesUseCase
  implements UseCase<DataState<PaginatedData<PurchaseEntity>>, ListPurchasesUseCaseParams>
{
  constructor(
    private readonly purchaseRepository: PurchaseRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListPurchasesUseCaseParams): Promise<DataState<PaginatedData<PurchaseEntity>>> {
    try {
      const session = await this.resolveSession();
      return await this.purchaseRepository.list(params.params, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
