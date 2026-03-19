import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";
import { FixedCostRepository } from "@/features/fixed-cost/domain/repositories/fixed-cost";

export class UpdateFixedCostUseCaseParams {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}
}

export class UpdateFixedCostUseCase implements UseCase<DataState<FixedCostEntity>, UpdateFixedCostUseCaseParams> {
  constructor(
    private readonly fixedCostRepository: FixedCostRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: UpdateFixedCostUseCaseParams): Promise<DataState<FixedCostEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.fixedCostRepository.update(params.id, params.name, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
