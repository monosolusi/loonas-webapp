import { describe, expect, it } from "vitest";
import { isGeneralCashCategory } from "@/app/(authenticated)/accounting/cash-categories/_utils/general-cash-categories";

describe("isGeneralCashCategory", () => {
  it("is true for the curated 'Pendapatan Lain-lain' category", () => {
    expect(isGeneralCashCategory({ isCurated: true, name: "Pendapatan Lain-lain" })).toBe(true);
  });

  it("is true for the curated 'Beban Lain-lain' category", () => {
    expect(isGeneralCashCategory({ isCurated: true, name: "Beban Lain-lain" })).toBe(true);
  });

  it("is false for an ordinary curated category whose name is not on the allowlist", () => {
    expect(isGeneralCashCategory({ isCurated: true, name: "Penjualan Produk" })).toBe(false);
  });

  it("fails closed for a merchant-created category that happens to share a general category's name", () => {
    expect(isGeneralCashCategory({ isCurated: false, name: "Pendapatan Lain-lain" })).toBe(false);
  });

  it("is false for a merchant-created, non-curated category", () => {
    expect(isGeneralCashCategory({ isCurated: false, name: "Kategori Saya" })).toBe(false);
  });

  it("is case-sensitive — a near-match casing does not count as general", () => {
    expect(isGeneralCashCategory({ isCurated: true, name: "pendapatan lain-lain" })).toBe(false);
  });
});
