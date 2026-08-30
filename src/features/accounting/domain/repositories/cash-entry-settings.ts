import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashEntrySettingsEntity } from "@/features/accounting/domain/entities/cash-entry-settings";

/** Partial update — omitted fields are left unchanged, `null` clears the default. */
export type UpdateCashEntrySettingsParams = {
  defaultIncomeAccountId?: string | null;
  defaultExpenseAccountId?: string | null;
};

export interface CashEntrySettingsRepository {
  get(session: SessionEntity): Promise<DataState<CashEntrySettingsEntity>>;
  update(params: UpdateCashEntrySettingsParams, session: SessionEntity): Promise<DataState<CashEntrySettingsEntity>>;
}
