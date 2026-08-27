import { describe, expect, it } from "vitest";
import { resolveCashEntryStatusChip } from "@/app/(authenticated)/accounting/cash-entries/[id]/_utils/resolve-cash-entry-status-chip";
import { CashEntryStatus } from "@/features/accounting/domain/enums/cash-entry-status";

describe("resolveCashEntryStatusChip", () => {
  it("resolves Active to a success chip", () => {
    expect(resolveCashEntryStatusChip(CashEntryStatus.Active)).toEqual({ label: "Aktif", variant: "success" });
  });

  it("resolves Cancelled to a neutral chip", () => {
    expect(resolveCashEntryStatusChip(CashEntryStatus.Cancelled)).toEqual({
      label: "Dibatalkan",
      variant: "neutral",
    });
  });

  it("resolves Cancellation to a warning chip", () => {
    expect(resolveCashEntryStatusChip(CashEntryStatus.Cancellation)).toEqual({
      label: "Pembatalan",
      variant: "warning",
    });
  });
});
