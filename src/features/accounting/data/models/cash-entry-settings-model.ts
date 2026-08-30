import { AbstractModel } from "@/core/resources/model";
import { CashEntrySettingsEntity } from "@/features/accounting/domain/entities/cash-entry-settings";

/**
 * Flat two-field resource — the settings response carries nullable UUIDs only, so there is no
 * nested account object to model (callers join the ids against the ledger-account list).
 */
export class CashEntrySettingsModel implements AbstractModel {
  constructor(
    public readonly defaultIncomeAccountId: string | null,
    public readonly defaultExpenseAccountId: string | null,
  ) {}

  public static fromJson(data: Record<string, any>): CashEntrySettingsModel {
    return new CashEntrySettingsModel(
      data["default_income_account_id"] ?? null,
      data["default_expense_account_id"] ?? null,
    );
  }

  public toEntity(): CashEntrySettingsEntity {
    return new CashEntrySettingsEntity({
      defaultIncomeAccountId: this.defaultIncomeAccountId,
      defaultExpenseAccountId: this.defaultExpenseAccountId,
    });
  }
}
