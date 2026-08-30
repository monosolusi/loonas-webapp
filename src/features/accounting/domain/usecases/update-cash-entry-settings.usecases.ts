import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CashEntrySettingsRepository } from "@/features/accounting/domain/repositories/cash-entry-settings";
import { CashEntrySettingsEntity } from "@/features/accounting/domain/entities/cash-entry-settings";

/**
 * Partial update — omitted fields are left unchanged, an explicit `null` clears the default.
 * A 422 `CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH` here means the chosen account is not
 * compatible with the direction being configured (income for income, expense/asset for
 * expense); the caller surfaces that, it does not pre-filter with the eligibility helper.
 */
export class UpdateCashEntrySettingsUseCaseParams {
  constructor(
    public readonly defaultIncomeAccountId?: string | null,
    public readonly defaultExpenseAccountId?: string | null,
  ) {}
}

export class UpdateCashEntrySettingsUseCase implements UseCase<
  DataState<CashEntrySettingsEntity>,
  UpdateCashEntrySettingsUseCaseParams
> {
  constructor(
    private readonly repo: CashEntrySettingsRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: UpdateCashEntrySettingsUseCaseParams): Promise<DataState<CashEntrySettingsEntity>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.updateSettings(params, session));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async updateSettings(
    params: UpdateCashEntrySettingsUseCaseParams,
    session: SessionEntity,
  ): Promise<CashEntrySettingsEntity> {
    const result = await this.repo.update(
      {
        defaultIncomeAccountId: params.defaultIncomeAccountId,
        defaultExpenseAccountId: params.defaultExpenseAccountId,
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
