import { describe, expect, it } from "vitest";
import { CashCategoryAccountEntity } from "@/features/accounting/domain/entities/cash-category-account";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { buildCashCategoryOptions } from "@/app/(authenticated)/accounting/cash-entries/new/_utils/build-cash-category-options";

function makeCategory(id: string, name: string, code = "1-0000"): CashCategoryEntity {
  return new CashCategoryEntity({
    id,
    direction: CashEntryDirection.In,
    name,
    account: new CashCategoryAccountEntity({ id: `account-${id}`, code, name: `Akun ${id}` }),
    isCurated: false,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  });
}

describe("buildCashCategoryOptions", () => {
  it("maps the category name to the option label with no account code", () => {
    const category = makeCategory("cat-1", "Penjualan Tunai");

    const result = buildCashCategoryOptions([category], null);

    expect(result[0].label).toEqual("Penjualan Tunai");
  });

  it("carries the account code and name in keywords only, never in the label", () => {
    const category = makeCategory("cat-1", "Penjualan Tunai", "4-1000");

    const result = buildCashCategoryOptions([category], null);

    expect(result).toEqual([
      {
        id: "cat-1",
        label: "Penjualan Tunai",
        keywords: "4-1000 — Akun cat-1",
        entity: category,
      },
    ]);
  });

  it("appends the selected category when it is absent from the fetched list", () => {
    const listed = makeCategory("cat-1", "Penjualan Tunai");
    const selected = makeCategory("cat-2", "Kategori Baru");

    const result = buildCashCategoryOptions([listed], selected);

    expect(result.map((option) => option.id)).toEqual(["cat-1", "cat-2"]);
  });

  it("does not duplicate a selection already present in the fetched list", () => {
    const listed = makeCategory("cat-1", "Penjualan Tunai");

    const result = buildCashCategoryOptions([listed], listed);

    expect(result.map((option) => option.id)).toEqual(["cat-1"]);
  });

  it("returns an empty list for an empty category list and no selection", () => {
    expect(buildCashCategoryOptions([], null)).toEqual([]);
  });

  it("folds the selected category back into the option list when the fetched list is empty", () => {
    const selected = makeCategory("cat-2", "Kategori Baru");

    const result = buildCashCategoryOptions([], selected);

    expect(result).toEqual([
      {
        id: "cat-2",
        label: "Kategori Baru",
        keywords: "1-0000 — Akun cat-2",
        entity: selected,
      },
    ]);
  });
});
