import { DateTime } from "luxon";
import { SourceRefTypeLabel } from "@/features/balance/domain/enums/source-ref-type";

/**
 * Pure render-decision inputs for one balance-movement row. These live outside `.tsx`
 * so the Vitest node suite can lock the load-bearing semantics: correction-cell
 * truncation, source-reference truncation, the unrecognised-`sourceRefType` fallback,
 * and the Indonesian date locale.
 */

export type CorrectionCellDisplay =
  | { readonly kind: "none" }
  | { readonly kind: "correction"; readonly label: string; readonly title: string };

const ID_PREFIX_LENGTH = 8;

/**
 * Structural subset of `BalanceMovementEntity` — this util only formats, it never re-derives
 * `isCorrection`. `BalanceMovementEntity.isCorrection` stays the single source of the predicate
 * (CLAUDE.md derived-invariant rule); this type just lets callers pass the entity directly.
 */
export type CorrectionCellInput = {
  readonly isCorrection: boolean;
  readonly correctsMovementId: string | null;
};

export function classifyCorrectionCell(movement: CorrectionCellInput): CorrectionCellDisplay {
  if (!movement.isCorrection) return { kind: "none" };
  // `isCorrection` guarantees `correctsMovementId !== null` (BalanceMovementEntity's own
  // invariant) — this util only formats, it never re-derives the predicate.
  const correctsMovementId = movement.correctsMovementId as string;
  return {
    kind: "correction",
    label: `${correctsMovementId.slice(0, ID_PREFIX_LENGTH)}…`,
    title: correctsMovementId,
  };
}

export type SourceReferenceDisplay = {
  readonly label: string;
  readonly title: string;
};

/**
 * `SourceRefTypeLabel` is a TOTAL `Record<SourceRefTypeType, string>`, so indexing it
 * with the entity's own (narrow) type can never miss — and a `?? sourceRefType`
 * fallback on that lookup would be dead code. `sourceRefType` is widened to `string`
 * here specifically so a BE-added enum member the FE hasn't shipped a label for yet
 * falls back to the raw value instead of rendering `undefined`.
 */
export function resolveSourceRefTypeLabel(sourceRefType: string): string {
  const labels: Record<string, string> = SourceRefTypeLabel;
  return labels[sourceRefType] ?? sourceRefType;
}

export function buildSourceReferenceDisplay(sourceRefType: string, sourceRefId: string): SourceReferenceDisplay {
  const label = resolveSourceRefTypeLabel(sourceRefType);
  return { label: `${label} · ${sourceRefId.slice(0, ID_PREFIX_LENGTH)}…`, title: sourceRefId };
}

/** House convention (`journal.ts:63`): `.setLocale("id")` is load-bearing — omitting it
 * (as `stock-movement-row.tsx:26` does) renders English month abbreviations. */
export function formatMovementDate(createdAt: string): string {
  return DateTime.fromISO(createdAt).setLocale("id").toFormat("dd MMM yyyy");
}
