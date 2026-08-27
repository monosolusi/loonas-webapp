import { describe, expect, it } from "vitest";
import { formatCashEntryRange } from "@/app/(authenticated)/accounting/cash-entries/_utils/format-cash-entry-range";

describe("formatCashEntryRange", () => {
  it("returns 'Semua periode' when both bounds are undefined", () => {
    expect(formatCashEntryRange({ from: undefined, to: undefined })).toBe("Semua periode");
  });

  it("returns 'Semua periode' when only `from` is set (partial pick)", () => {
    expect(formatCashEntryRange({ from: new Date(2026, 7, 1), to: undefined })).toBe("Semua periode");
  });

  it("returns 'Semua periode' when only `to` is set (partial pick)", () => {
    expect(formatCashEntryRange({ from: undefined, to: new Date(2026, 7, 27) })).toBe("Semua periode");
  });

  it("formats a complete range in Indonesian locale", () => {
    expect(formatCashEntryRange({ from: new Date(2026, 7, 1), to: new Date(2026, 7, 27) })).toBe(
      "1 Agu 2026 – 27 Agu 2026",
    );
  });
});
