import { describe, expect, it } from "vitest";
import { resolveCashEntryCrossReference } from "@/app/(authenticated)/accounting/cash-entries/_utils/resolve-cash-entry-cross-reference";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashCategoryAccountEntity } from "@/features/accounting/domain/entities/cash-category-account";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { CashEntryStatus } from "@/features/accounting/domain/enums/cash-entry-status";

/**
 * `CashEntryEntity.category` is a full `CashCategoryEntity`, so a bare object literal no longer
 * typechecks and these fixtures need a complete one. Nothing here reads the category at all —
 * only `status`/`cancelsId`/`cancelledById` drive the cross-reference — so every category field
 * is a fixed dummy value, mirroring the `buildEntry()` style below.
 */
function buildCategory(overrides: Partial<ConstructorParameters<typeof CashCategoryEntity>[0]> = {}) {
  return new CashCategoryEntity({
    id: "cat-1",
    name: "Penjualan",
    direction: CashEntryDirection.In,
    account: new CashCategoryAccountEntity({ id: "acc-1", code: "4-1000", name: "Penjualan" }),
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

describe("resolveCashEntryCrossReference", () => {
  it("returns none for an active entry", () => {
    expect(resolveCashEntryCrossReference(buildEntry({ status: CashEntryStatus.Active }))).toEqual({
      kind: "none",
    });
  });

  it("returns is-cancellation with a link when cancelsId is present", () => {
    const result = resolveCashEntryCrossReference(
      buildEntry({ status: CashEntryStatus.Cancellation, cancelsId: "entry-original" }),
    );
    expect(result.kind).toBe("is-cancellation");
    if (result.kind === "is-cancellation") {
      expect(result.targetId).toBe("entry-original");
    }
  });

  it("returns is-cancellation WITHOUT a link when cancelsId is missing — never silently absent", () => {
    const result = resolveCashEntryCrossReference(
      buildEntry({ status: CashEntryStatus.Cancellation, cancelsId: null }),
    );
    expect(result.kind).toBe("is-cancellation");
    if (result.kind === "is-cancellation") {
      expect(result.targetId).toBeNull();
    }
  });

  it("returns was-cancelled with a link when cancelledById is present", () => {
    const result = resolveCashEntryCrossReference(
      buildEntry({ status: CashEntryStatus.Cancelled, cancelledById: "entry-cancellation" }),
    );
    expect(result.kind).toBe("was-cancelled");
    if (result.kind === "was-cancelled") {
      expect(result.targetId).toBe("entry-cancellation");
    }
  });

  it("returns was-cancelled WITHOUT a link when cancelledById is missing", () => {
    const result = resolveCashEntryCrossReference(
      buildEntry({ status: CashEntryStatus.Cancelled, cancelledById: null }),
    );
    expect(result.kind).toBe("was-cancelled");
    if (result.kind === "was-cancelled") {
      expect(result.targetId).toBeNull();
    }
  });

  it("every status other than Active produces a visible chip regardless of id presence", () => {
    const statuses = [CashEntryStatus.Cancellation, CashEntryStatus.Cancelled];
    for (const status of statuses) {
      const result = resolveCashEntryCrossReference(buildEntry({ status, cancelsId: null, cancelledById: null }));
      expect(result.kind).not.toBe("none");
      if (result.kind !== "none") {
        expect(result.chip.label.length).toBeGreaterThan(0);
      }
    }
  });
});
