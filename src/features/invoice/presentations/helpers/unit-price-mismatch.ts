import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export type UnitPriceMismatch = {
  /** Resolved back to a cart row; `null` when the cart changed under us. */
  variantId: string | null;
  /** Zero-based, exactly as returned. Retained for diagnostics. */
  lineIndex: number;
  /** Raw and unrounded, exactly as returned. */
  submittedUnitPrice: number;
  resolvedUnitPrice: number;
};

/**
 * Parses 422 UNIT_PRICE_MISMATCH and maps its line back to a cart row.
 *
 * The body is FLAT — `variant_id`, `line_index`, `submitted_unit_price` and
 * `resolved_unit_price` sit alongside `code`/`message` with no `details` envelope, so
 * `HttpRequest` spreads them straight onto `ServerError.details`.
 *
 * `line_index` names only the lowest-indexed divergent line, never a list. Returns `null`
 * on a malformed body rather than coercing, so the caller can fall back to a cart-level
 * message instead of flagging the wrong row.
 */
export function parseUnitPriceMismatch(err: unknown, submittedVariantIds: string[]): UnitPriceMismatch | null {
  if (!(err instanceof ServerError)) return null;
  if (err.code !== ErrorCodes.UNIT_PRICE_MISMATCH.code) return null;

  const details: Record<string, any> = err.details ?? {};
  const lineIndex = details["line_index"];
  const submitted = details["submitted_unit_price"];
  const resolved = details["resolved_unit_price"];

  if (!Number.isInteger(lineIndex) || lineIndex < 0) return null;
  if (!Number.isFinite(submitted) || !Number.isFinite(resolved)) return null;

  // Prefer the index, but cross-check it against the variant the server named: if the two
  // disagree the cart moved between submit and response, and flagging by index would
  // point at the wrong product.
  const namedVariantId = typeof details["variant_id"] === "string" ? details["variant_id"] : null;
  const atIndex = submittedVariantIds[lineIndex] ?? null;
  const variantId =
    namedVariantId === null || atIndex === namedVariantId
      ? atIndex
      : (submittedVariantIds.find((id) => id === namedVariantId) ?? null);

  return {
    variantId,
    lineIndex,
    submittedUnitPrice: submitted,
    resolvedUnitPrice: resolved,
  };
}
