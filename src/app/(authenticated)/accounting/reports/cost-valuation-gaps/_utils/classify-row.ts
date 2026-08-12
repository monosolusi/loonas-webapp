import { CostValuationGapRowEntity } from "@/features/accounting/domain/entities/cost-valuation-gap";

/**
 * Pure render-decision inputs for one cost-valuation-gap row. These live outside
 * `.tsx` so the Vitest node suite can lock the four load-bearing semantics:
 * action/no-action distinction, null-count = unclassified (not zero),
 * null-amount = em-dash (not Rp 0), and correcting-entry mapping label.
 */

export type RowDisplayClass = "action" | "no-action";

export function classifyRow(row: CostValuationGapRowEntity): RowDisplayClass {
  return row.actionRequired ? "action" : "no-action";
}

export type ClassifiedCount =
  | { readonly kind: "unclassified" }
  | { readonly kind: "count"; readonly value: number };

/** null = unclassified, never zero. Non-null = the integer count. */
export function classifyCount(count: number | null): ClassifiedCount {
  return count === null ? { kind: "unclassified" } : { kind: "count", value: count };
}

export type NullableAmount =
  | { readonly kind: "em-dash" }
  | { readonly kind: "amount"; readonly value: number };

/** null = ordinary case, rendered as em-dash — never Rp 0. */
export function classifyNullableAmount(amount: number | null): NullableAmount {
  return amount === null ? { kind: "em-dash" } : { kind: "amount", value: amount };
}

export type CorrectingEntryDisplay =
  | { readonly kind: "unmapped" }
  | { readonly kind: "mapped"; readonly label: string };

/** null = no resolved COA mapping. Present = "{debit.name} ({debit.code}) · {credit.name} ({credit.code})". */
export function classifyCorrectingEntry(row: CostValuationGapRowEntity): CorrectingEntryDisplay {
  if (row.correctingEntry === null) return { kind: "unmapped" };
  const { debit, credit } = row.correctingEntry;
  return {
    kind: "mapped",
    label: `${debit.name} (${debit.code}) · ${credit.name} (${credit.code})`,
  };
}

export type SubjectDisplay = {
  readonly label: string;
  readonly unit: string | null;
};

/**
 * Compose the display label for the gap subject.
 * `variant_name: null` (raw_material axis) → name + unit only.
 * `variant_name` present (verbatim, may be literal "Default") → "name — variant_name".
 */
export function buildSubjectDisplay(row: CostValuationGapRowEntity): SubjectDisplay {
  const name = row.name ?? "—";
  if (row.variantName === null) {
    return { label: name, unit: row.unit };
  }
  return { label: `${name} — ${row.variantName}`, unit: null };
}