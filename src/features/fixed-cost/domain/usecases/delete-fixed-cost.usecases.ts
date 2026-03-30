import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { FixedCostRepository } from "@/features/fixed-cost/domain/repositories/fixed-cost";

export class DeleteFixedCostUseCaseParams {
  constructor(public readonly id: string) {}
}

export class DeleteFixedCostUseCase implements UseCase<DataState<void>, DeleteFixedCostUseCaseParams> {
  constructor(
    private readonly fixedCostRepository: FixedCostRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: DeleteFixedCostUseCaseParams): Promise<DataState<void>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.fixedCostRepository.delete(params.id, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
