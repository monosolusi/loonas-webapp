import { describe, expect, it } from "vitest";
import {
  AccountRefEntity,
  CorrectingEntryEntity,
  CostValuationGapRowEntity,
} from "@/features/accounting/domain/entities/cost-valuation-gap";
import {
  buildSubjectDisplay,
  classifyCorrectingEntry,
  classifyCount,
  classifyNullableAmount,
  classifyRow,
} from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_utils/classify-row";

function makeRow(overrides: Partial<CostValuationGapRowEntity> = {}): CostValuationGapRowEntity {
  const or = <T>(v: T | undefined, fallback: T): T => (v !== undefined ? v : fallback);
  return new CostValuationGapRowEntity(
    or(overrides.gapKind, "variant"),
    or(overrides.subjectId, "subj-1"),
    or(overrides.name, "Kopi Arabica"),
    or(overrides.variantName, "Default"),
    or(overrides.unit, null),
    or(overrides.deleted, false),
    or(overrides.occurrenceCount, 3),
    or(overrides.affectedSaleCount, 2),
    or(overrides.unvaluedQty, 10),
    or(overrides.firstPostingDate, "2026-01-01"),
    or(overrides.lastPostingDate, "2026-01-31"),
    or(overrides.hppOmittedCount, 2),
    or(overrides.hppUnderstatedCount, 1),
    or(overrides.cause, "no_source_record"),
    or(overrides.actionRequired, true),
    or(overrides.actionText, "Catat pembelian untuk item ini."),
    or(overrides.correctingEntry, null),
    or(overrides.currentWac, null),
    or(overrides.correctingAmount, null),
  );
}

function makeCorrectingEntry(): CorrectingEntryEntity {
  return new CorrectingEntryEntity(
    new AccountRefEntity("5000", "HPP"),
    new AccountRefEntity("1400", "Persediaan"),
  );
}

describe("classifyRow", () => {
  it("returns 'action' when action_required is true", () => {
    expect(classifyRow(makeRow({ actionRequired: true }))).toBe("action");
  });

  it("returns 'no-action' when action_required is false", () => {
    expect(classifyRow(makeRow({ actionRequired: false }))).toBe("no-action");
  });
});

describe("classifyCount (null = unclassified, never zero)", () => {
  it("classifies null as unclassified", () => {
    expect(classifyCount(null)).toEqual({ kind: "unclassified" });
  });

  it("classifies 0 as a real count, not unclassified", () => {
    expect(classifyCount(0)).toEqual({ kind: "count", value: 0 });
  });

  it("classifies a positive integer as a count", () => {
    expect(classifyCount(5)).toEqual({ kind: "count", value: 5 });
  });
});

describe("classifyNullableAmount (null = em-dash, never Rp 0)", () => {
  it("classifies null as em-dash", () => {
    expect(classifyNullableAmount(null)).toEqual({ kind: "em-dash" });
  });

  it("classifies 0 as a real amount, not em-dash", () => {
    expect(classifyNullableAmount(0)).toEqual({ kind: "amount", value: 0 });
  });

  it("classifies a positive number as an amount", () => {
    expect(classifyNullableAmount(15000)).toEqual({ kind: "amount", value: 15000 });
  });
});

describe("classifyCorrectingEntry", () => {
  it("returns 'unmapped' when correcting_entry is null", () => {
    expect(classifyCorrectingEntry(makeRow({ correctingEntry: null }))).toEqual({ kind: "unmapped" });
  });

  it("returns a mapped label with debit and credit codes when present", () => {
    const row = makeRow({ correctingEntry: makeCorrectingEntry() });
    expect(classifyCorrectingEntry(row)).toEqual({
      kind: "mapped",
      label: "HPP 5000 · Persediaan 1400",
    });
  });
});

describe("buildSubjectDisplay", () => {
  it("composes 'name — variant_name' on the variant axis (variant_name present, even literal 'Default')", () => {
    const row = makeRow({ name: "Kopi Arabica", variantName: "Default", unit: null });
    expect(buildSubjectDisplay(row)).toEqual({ label: "Kopi Arabica — Default", unit: null });
  });

  it("shows name + unit only on the raw_material axis (variant_name null)", () => {
    const row = makeRow({ name: "Biji Kopi", variantName: null, unit: "gram" });
    expect(buildSubjectDisplay(row)).toEqual({ label: "Biji Kopi", unit: "gram" });
  });

  it("falls back to em-dash label when name is null", () => {
    const row = makeRow({ name: null, variantName: null, unit: "gram" });
    expect(buildSubjectDisplay(row)).toEqual({ label: "—", unit: "gram" });
  });
});