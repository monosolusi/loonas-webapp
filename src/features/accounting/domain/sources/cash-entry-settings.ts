import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashEntrySettingsModel } from "@/features/accounting/data/models/cash-entry-settings-model";

/**
 * Partial update — omitted fields are left unchanged, an explicit `null` clears the default.
 * The distinction only survives `JSON.stringify` if the body is built key by key (LNS-573).
 */
export type UpdateCashEntrySettingsServiceParams = {
  defaultIncomeAccountId?: string | null;
  defaultExpenseAccountId?: string | null;
};

export interface CashEntrySettingsService {
  get(session: SessionEntity): Promise<CashEntrySettingsModel>;
  update(params: UpdateCashEntrySettingsServiceParams, session: SessionEntity): Promise<CashEntrySettingsModel>;
}
