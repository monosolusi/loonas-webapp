import { describe, expect, it } from "vitest";
import { filterCashCategories } from "@/app/(authenticated)/accounting/cash-categories/_utils/filter-cash-categories";
import { CashCategoryAccountEntity } from "@/features/accounting/domain/entities/cash-category-account";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

function buildCategory(overrides: Partial<ConstructorParameters<typeof CashCategoryEntity>[0]> = {}) {
  return new CashCategoryEntity({
    id: "cat-1",
    name: "Penjualan",
    direction: CashEntryDirection.In,
    account: new CashCategoryAccountEntity({ id: "acc-1", code: "4-1000", name: "Pendapatan Penjualan" }),
    isCurated: true,
    createdAt: "2026-08-27T09:15:00.000+07:00",
    updatedAt: "2026-08-27T09:15:00.000+07:00",
    ...overrides,
  });
}

describe("filterCashCategories", () => {
  const categories = [
    buildCategory({ id: "cat-1", name: "Penjualan" }),
    buildCategory({
      id: "cat-2",
      name: "Beban Listrik",
      account: new CashCategoryAccountEntity({ id: "acc-2", code: "5-2000", name: "Beban Operasional" }),
    }),
    buildCategory({
      id: "cat-3",
      name: "Kas Kecil",
      account: new CashCategoryAccountEntity({ id: "acc-3", code: "1-1100", name: "Kas" }),
    }),
  ];

  it("returns the whole list for an empty query", () => {
    expect(filterCashCategories(categories, "")).toHaveLength(3);
  });

  it("returns the whole list for a whitespace-only query", () => {
    expect(filterCashCategories(categories, "   ")).toHaveLength(3);
  });

  it("matches a category name case-insensitively", () => {
    expect(filterCashCategories(categories, "PENJUALAN").map((category) => category.id)).toEqual(["cat-1"]);
  });

  it("matches an account code", () => {
    expect(filterCashCategories(categories, "1-1100").map((category) => category.id)).toEqual(["cat-3"]);
  });

  it("matches an account name", () => {
    expect(filterCashCategories(categories, "pendapatan").map((category) => category.id)).toEqual(["cat-1"]);
  });

  it("returns nothing when no field matches", () => {
    expect(filterCashCategories(categories, "gaji")).toEqual([]);
  });

  it("returns a new array rather than the input reference", () => {
    expect(filterCashCategories(categories, "")).not.toBe(categories);
  });
});
