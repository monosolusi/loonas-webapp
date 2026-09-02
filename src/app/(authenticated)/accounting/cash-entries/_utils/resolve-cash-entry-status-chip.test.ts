import { describe, expect, it } from "vitest";
import { resolveCashEntryStatusChip } from "@/app/(authenticated)/accounting/cash-entries/_utils/resolve-cash-entry-status-chip";
import { CashEntryStatus } from "@/features/accounting/domain/enums/cash-entry-status";

describe("resolveCashEntryStatusChip", () => {
  it("resolves Active to no chip (absence = active)", () => {
    expect(resolveCashEntryStatusChip(CashEntryStatus.Active)).toEqual({ kind: "none" });
  });

  it("resolves Cancelled to a neutral chip", () => {
    expect(resolveCashEntryStatusChip(CashEntryStatus.Cancelled)).toEqual({
      kind: "chip",
      chip: { label: "Dibatalkan", variant: "neutral" },
    });
  });

  it("resolves Cancellation to a warning chip", () => {
    expect(resolveCashEntryStatusChip(CashEntryStatus.Cancellation)).toEqual({
      kind: "chip",
      chip: { label: "Pembatalan", variant: "warning" },
    });
  });

  it("resolves every CashEntryStatus to a known kind, and every chip carries a non-empty label", () => {
    for (const status of Object.values(CashEntryStatus)) {
      const result = resolveCashEntryStatusChip(status);
      expect(["none", "chip"]).toContain(result.kind);
      if (result.kind === "chip") {
        expect(result.chip.label.length).toBeGreaterThan(0);
      }
    }
  });
});
