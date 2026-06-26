import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { AccountingPeriodRepository, ListPeriodsResult } from "@/features/accounting/domain/repositories/accounting-period";

type ListPeriodsUseCaseInput = { page?: number; limit?: number; status?: "open" | "closed" };

export class ListPeriodsUseCaseParams {
  constructor(public readonly params: ListPeriodsUseCaseInput) {}
}

export class ListPeriodsUseCase implements UseCase<DataState<ListPeriodsResult>, ListPeriodsUseCaseParams> {
  constructor(
    private readonly repo: AccountingPeriodRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListPeriodsUseCaseParams): Promise<DataState<ListPeriodsResult>> {
    try {
      const session = await this.sessionRepo.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return this.repo.list(params.params, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
