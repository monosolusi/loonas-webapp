import { AbstractEntity } from "@/core/resources/entity";

type CashEntrySettingsEntityConstructor = {
  defaultIncomeAccountId: string | null;
  defaultExpenseAccountId: string | null;
};

/**
 * Account defaults applied by the cash-entry create flow. Both ids are nullable — `null` means
 * "no default configured", which is the ordinary state, not a missing value.
 */
export class CashEntrySettingsEntity implements AbstractEntity {
  public readonly defaultIncomeAccountId: string | null;
  public readonly defaultExpenseAccountId: string | null;

  constructor(args: CashEntrySettingsEntityConstructor) {
    this.defaultIncomeAccountId = args.defaultIncomeAccountId;
    this.defaultExpenseAccountId = args.defaultExpenseAccountId;
  }
}
