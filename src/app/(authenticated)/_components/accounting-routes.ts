/**
 * Single source of truth for the "Akuntansi" workspace carve-out.
 *
 * The authenticated sidebar swaps into accounting mode whenever the current
 * pathname sits under `/accounting` — driving the mode off the URL keeps it
 * robust across refreshes and deep-links (same approach as the POS shell).
 *
 * Every accounting surface now lives under `/accounting/*` (journals, ledger,
 * fixed costs, profitability, tax, chart of accounts, periods, reports); the
 * overview sits at the bare `ACCOUNTING_ENTRY` route.
 */
export const ACCOUNTING_ENTRY = "/accounting";

export const ACCOUNTING_PREFIXES = ["/accounting"] as const;

export function isAccountingPath(pathname: string): boolean {
  return ACCOUNTING_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
