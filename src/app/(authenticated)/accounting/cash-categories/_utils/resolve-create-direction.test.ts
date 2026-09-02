import { describe, expect, it } from "vitest";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { resolveCreateDirection } from "@/app/(authenticated)/accounting/cash-categories/_utils/resolve-create-direction";

describe("resolveCreateDirection", () => {
  it("resolves 'Semua' (undefined) to choose mode, never a defaulted direction", () => {
    expect(resolveCreateDirection(undefined)).toEqual({ mode: "choose" });
  });

  it("resolves the Kas Masuk tab to a fixed In direction", () => {
    expect(resolveCreateDirection(CashEntryDirection.In)).toEqual({
      mode: "fixed",
      direction: CashEntryDirection.In,
    });
  });

  it("resolves the Kas Keluar tab to a fixed Out direction", () => {
    expect(resolveCreateDirection(CashEntryDirection.Out)).toEqual({
      mode: "fixed",
      direction: CashEntryDirection.Out,
    });
  });
});
