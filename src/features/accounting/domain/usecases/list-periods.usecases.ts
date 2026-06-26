import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { AccountingPeriodRepository } from "@/features/accounting/domain/repositories/accounting-period";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { PaginationMeta } from "@/core/resources/paginated";

type ListPeriodsUseCaseInput = { page?: number; limit?: number; status?: "open" | "closed" };

export type ListPeriodsUseCaseResult = { data: AccountingPeriodEntity[]; meta: PaginationMeta };

export class ListPeriodsUseCaseParams {
  constructor(public readonly params: ListPeriodsUseCaseInput) {}
}

export class ListPeriodsUseCase implements UseCase<DataState<ListPeriodsUseCaseResult>, ListPeriodsUseCaseParams> {
  constructor(
    private readonly repo: AccountingPeriodRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListPeriodsUseCaseParams): Promise<DataState<ListPeriodsUseCaseResult>> {
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
