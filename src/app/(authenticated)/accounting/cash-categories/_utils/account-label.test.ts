import { describe, expect, it } from "vitest";
import { resolveAccountLabel } from "@/app/(authenticated)/accounting/cash-categories/_utils/account-label";
import { CashCategoryAccountEntity } from "@/features/accounting/domain/entities/cash-category-account";

function buildAccount(overrides: Partial<ConstructorParameters<typeof CashCategoryAccountEntity>[0]> = {}) {
  return new CashCategoryAccountEntity({ id: "acc-1", code: "4-1000", name: "Pendapatan Penjualan", ...overrides });
}

describe("resolveAccountLabel", () => {
  it("joins code and name when both are present", () => {
    expect(resolveAccountLabel(buildAccount())).toBe("4-1000 — Pendapatan Penjualan");
  });

  it("falls back to the code alone when the name is missing", () => {
    expect(resolveAccountLabel(buildAccount({ name: "" }))).toBe("4-1000");
  });

  it("falls back to the name alone when the code is missing", () => {
    expect(resolveAccountLabel(buildAccount({ code: "" }))).toBe("Pendapatan Penjualan");
  });

  it("returns null for an account with no code and no name — the em-dash case", () => {
    expect(resolveAccountLabel(buildAccount({ code: "", name: "" }))).toBeNull();
  });

  it("treats a whitespace-only label as missing", () => {
    expect(resolveAccountLabel(buildAccount({ code: "  ", name: "  " }))).toBeNull();
  });
});
