import { describe, expect, it } from "vitest";
import { CashEntryModel } from "@/features/accounting/data/models/cash-entry-model";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";

function baseJson(overrides: Record<string, any> = {}) {
  return {
    id: "entry-1",
    direction: "in",
    amount: 50000,
    reference_number: "KM-0001",
    status: "active",
    note: null,
    entry_date: "2026-08-27",
    category: { id: "cat-1", name: "Penjualan", direction: "in" },
    journal_entry_id: "journal-1",
    cancels_id: null,
    cancelled_by_id: null,
    created_by_user_id: "user-1",
    created_at: "2026-08-27T00:00:00.000Z",
    updated_at: "2026-08-27T00:00:00.000Z",
    ...overrides,
  };
}

describe("CashEntryModel.fromJson / toEntity", () => {
  it("parses amount as a JSON number", () => {
    const entity = CashEntryModel.fromJson(baseJson({ amount: 50000 })).toEntity();
    expect(entity.amount).toBe(50000);
    expect(typeof entity.amount).toBe("number");
  });

  it("parses amount as a string (Postgres NUMERIC) into a number", () => {
    const entity = CashEntryModel.fromJson(baseJson({ amount: "50000" })).toEntity();
    expect(entity.amount).toBe(50000);
    expect(typeof entity.amount).toBe("number");
  });

  it("maps entry_date to entryDate", () => {
    const entity = CashEntryModel.fromJson(baseJson({ entry_date: "2026-08-27" })).toEntity();
    expect(entity.entryDate).toBe("2026-08-27");
  });

  it("parses the nested category into a full CashCategoryEntity", () => {
    const entity = CashEntryModel.fromJson(
      baseJson({ category: { id: "cat-9", name: "Modal", direction: "out" } }),
    ).toEntity();
    // The wire carries only `id`/`name`/`direction`; the model's remaining fields default.
    expect(entity.category).toBeInstanceOf(CashCategoryEntity);
    expect(entity.category.id).toBe("cat-9");
    expect(entity.category.name).toBe("Modal");
    expect(entity.category.direction).toBe("out");
    expect(entity.category.account).toEqual({ id: "", code: "", name: "" });
    expect(entity.category.isCurated).toBe(false);
  });

  it("keeps nullable fields as null", () => {
    const entity = CashEntryModel.fromJson(
      baseJson({ note: null, journal_entry_id: null, cancels_id: null, cancelled_by_id: null }),
    ).toEntity();
    expect(entity.note).toBeNull();
    expect(entity.journalEntryId).toBeNull();
    expect(entity.cancelsId).toBeNull();
    expect(entity.cancelledById).toBeNull();
  });

  it("resolves the status getters and isMoneyIn for an active row", () => {
    const entity = CashEntryModel.fromJson(baseJson({ status: "active", direction: "in" })).toEntity();
    expect(entity.isCurrentlyActive).toBe(true);
    expect(entity.isCancelled).toBe(false);
    expect(entity.isCancellation).toBe(false);
    expect(entity.isMoneyIn).toBe(true);
  });

  it("resolves the status getters and isMoneyIn for a cancelled row", () => {
    const entity = CashEntryModel.fromJson(
      baseJson({ status: "cancelled", direction: "out", cancelled_by_id: "entry-2" }),
    ).toEntity();
    expect(entity.isCurrentlyActive).toBe(false);
    expect(entity.isCancelled).toBe(true);
    expect(entity.isCancellation).toBe(false);
    expect(entity.isMoneyIn).toBe(false);
  });

  it("resolves the status getters and isMoneyIn for a cancellation row, ignoring category.direction", () => {
    const entity = CashEntryModel.fromJson(
      baseJson({
        status: "cancellation",
        direction: "out",
        cancels_id: "entry-1",
        // `category.direction` is documented to match the entry's direction but is unreliable
        // for cancellation rows (LNS-762) — isMoneyIn must ignore it and read `direction` only.
        category: { id: "cat-1", name: "Penjualan", direction: "in" },
      }),
    ).toEntity();
    expect(entity.isCurrentlyActive).toBe(false);
    expect(entity.isCancelled).toBe(false);
    expect(entity.isCancellation).toBe(true);
    expect(entity.isMoneyIn).toBe(false);
  });
});
