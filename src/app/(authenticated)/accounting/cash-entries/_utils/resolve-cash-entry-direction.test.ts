import { describe, expect, it } from "vitest";
import { resolveCashEntryDirection } from "@/app/(authenticated)/accounting/cash-entries/_utils/resolve-cash-entry-direction";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { CashEntryStatus } from "@/features/accounting/domain/enums/cash-entry-status";

function buildCategory(overrides: Partial<ConstructorParameters<typeof CashCategoryEntity>[0]> = {}) {
  return new CashCategoryEntity({
    id: "cat-1",
    name: "Penjualan",
    direction: CashEntryDirection.In,
    account: { id: "acc-1", code: "4-1000", name: "Penjualan" },
    isCurated: true,
    createdAt: "2026-08-27T09:15:00.000+07:00",
    updatedAt: "2026-08-27T09:15:00.000+07:00",
    ...overrides,
  });
}

function buildEntry(overrides: Partial<ConstructorParameters<typeof CashEntryEntity>[0]> = {}): CashEntryEntity {
  return new CashEntryEntity({
    id: "entry-1",
    direction: CashEntryDirection.In,
    amount: 100000,
    category: buildCategory(),
    referenceNumber: "KM-0001",
    status: CashEntryStatus.Active,
    note: null,
    entryDate: "2026-08-27",
    journalEntryId: null,
    cancelsId: null,
    cancelledById: null,
    createdByUserId: "user-1",
    createdAt: "2026-08-27T09:15:00.000+07:00",
    updatedAt: "2026-08-27T09:15:00.000+07:00",
    ...overrides,
  });
}

describe("resolveCashEntryDirection", () => {
  it("labels an in-direction entry as Kas Masuk", () => {
    expect(resolveCashEntryDirection(buildEntry({ direction: CashEntryDirection.In }))).toEqual({
      label: "Kas Masuk",
    });
  });

  it("labels an out-direction entry as Kas Keluar", () => {
    expect(resolveCashEntryDirection(buildEntry({ direction: CashEntryDirection.Out }))).toEqual({
      label: "Kas Keluar",
    });
  });

  // LNS-762: on a cancellation row, `category.direction` is the OPPOSITE of the entry's own
  // `direction`. The label must follow the entry, never the category, or a cancellation row
  // renders under the wrong tab / wrong label entirely.
  it("follows entry.direction, never category.direction, on a cancellation row", () => {
    const cancellationOfAnOutEntry = buildEntry({
      direction: CashEntryDirection.Out,
      status: CashEntryStatus.Cancellation,
      category: buildCategory({ direction: CashEntryDirection.In }),
    });

    expect(resolveCashEntryDirection(cancellationOfAnOutEntry)).toEqual({ label: "Kas Keluar" });
  });
});
