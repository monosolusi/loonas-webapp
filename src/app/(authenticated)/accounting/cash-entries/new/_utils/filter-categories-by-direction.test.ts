import { describe, expect, it } from "vitest";
import { CashCategoryAccountEntity } from "@/features/accounting/domain/entities/cash-category-account";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { filterCategoriesByDirection } from "@/app/(authenticated)/accounting/cash-entries/new/_utils/filter-categories-by-direction";

function makeCategory(id: string, direction: CashEntryDirection): CashCategoryEntity {
  return new CashCategoryEntity({
    id,
    direction,
    name: `Kategori ${id}`,
    account: new CashCategoryAccountEntity({ id: `account-${id}`, code: "1-0000", name: `Akun ${id}` }),
    isCurated: false,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  });
}

describe("filterCategoriesByDirection", () => {
  it("keeps only the categories whose own direction matches", () => {
    const categories = [
      makeCategory("in-1", CashEntryDirection.In),
      makeCategory("out-1", CashEntryDirection.Out),
      makeCategory("in-2", CashEntryDirection.In),
    ];

    const result = filterCategoriesByDirection(categories, CashEntryDirection.In);

    expect(result.map((category) => category.id)).toEqual(["in-1", "in-2"]);
  });

  it("returns the money-out categories for CashEntryDirection.Out", () => {
    const categories = [makeCategory("in-1", CashEntryDirection.In), makeCategory("out-1", CashEntryDirection.Out)];

    const result = filterCategoriesByDirection(categories, CashEntryDirection.Out);

    expect(result.map((category) => category.id)).toEqual(["out-1"]);
  });

  it("returns an empty list when nothing matches, never the unfiltered input", () => {
    const categories = [makeCategory("in-1", CashEntryDirection.In)];

    const result = filterCategoriesByDirection(categories, CashEntryDirection.Out);

    expect(result).toEqual([]);
  });

  it("passes an empty input through as an empty list", () => {
    expect(filterCategoriesByDirection([], CashEntryDirection.In)).toEqual([]);
  });
});
