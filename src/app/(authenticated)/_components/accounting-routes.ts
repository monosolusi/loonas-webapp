/**
 * Single source of truth for the "Akuntansi" workspace carve-out.
 *
 * The authenticated sidebar swaps into accounting mode whenever the current
 * pathname sits under one of these prefixes — driving the mode off the URL keeps
 * it robust across refreshes and deep-links (same approach as the POS shell).
 *
 * Accounting pages keep their existing routes (`/finance/*`, `/chart-of-accounts/*`);
 * only the overview lives at the dedicated `ACCOUNTING_ENTRY` route. Note the two
 * `/settings/*` sub-paths trigger accounting mode while bare `/settings` does not —
 * they are accounting-gated Settings surfaces reached from within the workspace.
 */
export const ACCOUNTING_ENTRY = "/accounting";

export const ACCOUNTING_PREFIXES = [
  "/accounting",
  "/finance",
  "/chart-of-accounts",
  "/settings/fixed-costs",
  "/settings/tax-posture",
] as const;

export function isAccountingPath(pathname: string): boolean {
  return ACCOUNTING_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
