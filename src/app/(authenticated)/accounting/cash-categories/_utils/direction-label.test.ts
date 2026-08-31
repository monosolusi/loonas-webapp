import { describe, expect, it } from "vitest";
import { directionLabel } from "@/app/(authenticated)/accounting/cash-categories/_utils/direction-label";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

describe("directionLabel", () => {
  it("labels an in-direction category as Kas Masuk", () => {
    expect(directionLabel(CashEntryDirection.In)).toBe("Kas Masuk");
  });

  it("labels an out-direction category as Kas Keluar", () => {
    expect(directionLabel(CashEntryDirection.Out)).toBe("Kas Keluar");
  });
});
