import { describe, expect, it } from "vitest";
import { AccountType } from "@/features/accounting/domain/enums/account-type";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { eligibleAccountTypesFor } from "@/features/accounting/domain/helpers/cash-category-eligibility";

describe("eligibleAccountTypesFor", () => {
  it("maps money in to revenue only", () => {
    expect(eligibleAccountTypesFor(CashEntryDirection.In)).toEqual([AccountType.REVENUE]);
  });

  it("maps money out to expense and asset", () => {
    expect(eligibleAccountTypesFor(CashEntryDirection.Out)).toEqual([AccountType.EXPENSE, AccountType.ASSET]);
  });

  it("never admits COGS or a contra type for either direction", () => {
    const forbidden = [
      AccountType.COGS,
      AccountType.CONTRA_ASSET,
      AccountType.CONTRA_EQUITY,
      AccountType.CONTRA_REVENUE,
      AccountType.CONTRA_EXPENSE,
    ];
    for (const direction of [CashEntryDirection.In, CashEntryDirection.Out]) {
      const types = eligibleAccountTypesFor(direction);
      for (const type of forbidden) expect(types).not.toContain(type);
    }
  });

  it("never admits a liability or equity account", () => {
    for (const direction of [CashEntryDirection.In, CashEntryDirection.Out]) {
      const types = eligibleAccountTypesFor(direction);
      expect(types).not.toContain(AccountType.LIABILITY);
      expect(types).not.toContain(AccountType.EQUITY);
    }
  });
});
