"use client";

import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import clsx from "clsx";
import { mutate } from "swr";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TrialBalanceDrillLoading } from "@/features/accounting/presentations/components/reports/trial-balance-drill-loading";
import { TrialBalanceDrillEmpty } from "@/features/accounting/presentations/components/reports/trial-balance-drill-empty";
import { TrialBalanceDrillError } from "@/features/accounting/presentations/components/reports/trial-balance-drill-error";
import { useListLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-ledger-accounts";
import { useListTrialBalanceLines } from "@/features/accounting/presentations/hooks/use-list-trial-balance-lines";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { TrialBalanceLineEntity } from "@/features/accounting/domain/entities/trial-balance-line";

type TrialBalanceDrillPanelProps = {
  /** Composite "${account_code}-${index}" string — used for DOM id and aria-controls only. */
  readonly domId: string;
  /** The account code from the TB row — used to resolve the CoA uuid via ledger-accounts lookup. */
  readonly accountCode: string;
  readonly accountName: string;
  readonly from: string;
  readonly to: string;
  readonly isOpen: boolean;
};

type DrillDisplayState = "loading" | "error" | "not-found" | "empty" | "data";

function buildCounterpartMap(counterparts: TrialBalanceLineEntity[]): Map<string, TrialBalanceLineEntity[]> {
  const map = new Map<string, TrialBalanceLineEntity[]>();
  for (const cp of counterparts) {
    const list = map.get(cp.journalEntryId) ?? [];
    list.push(cp);
    map.set(cp.journalEntryId, list);
  }
  return map;
}

function formatCounterpartCodes(cps: TrialBalanceLineEntity[]): string {
  if (cps.length === 0) return "";
  const first2 = cps.slice(0, 2).map((c) => c.accountCode);
  const rest = cps.length - 2;
  if (rest > 0) return first2.join(" · ") + ` +${rest} lainnya`;
  return first2.join(" · ");
}

export function TrialBalanceDrillPanel({
  domId,
  accountCode,
  accountName,
  from,
  to,
  isOpen,
}: TrialBalanceDrillPanelProps) {
  const [page, setPage] = useState(1);

  // Step 1: resolve the CoA uuid from the account code via per-drill search.
  // We intentionally do NOT preload the full CoA list — it may be > 100 rows
  // and the limit is spec-capped, so a prebuilt map would silently miss rows.
  const { accounts: resolvedAccounts, loading: resolving } = useListLedgerAccounts({
    search: accountCode,
  });

  const resolvedId = useMemo(
    () => resolvedAccounts.find((a) => a.code === accountCode)?.id ?? null,
    [resolvedAccounts, accountCode],
  );

  // Step 2: fetch lines only once the uuid is resolved.
  const linesResult = useListTrialBalanceLines({
    accountId: resolvedId ?? "",
    from,
    to,
    page,
    enabled: resolvedId !== null,
  });

  const hasError = !resolving && !linesResult.loading && linesResult.error !== null;
  const hasData = !resolving && !linesResult.loading && linesResult.error === null && linesResult.data !== null;
  const lines = hasData ? linesResult.data.lines : [];
  const meta = hasData ? linesResult.data.meta : undefined;

  const counterparts = hasData ? linesResult.data.counterparts : [];
  const counterpartMap = useMemo(() => buildCounterpartMap(counterparts), [counterparts]);

  const displayState = useMemo((): DrillDisplayState => {
    if (resolving || linesResult.loading) return "loading";
    if (hasError) return "error";
    if (!resolving && resolvedId === null) return "not-found";
    if (hasData && lines.length === 0) return "empty";
    return "data";
  }, [resolving, linesResult.loading, hasError, resolvedId, hasData, lines.length]);

  const handleRetry = () => {
    if (resolvedId === null) return;
    // Revalidate only this drill's exact SWR key (account-scoped).
    mutate(
      (key: unknown) =>
        Array.isArray(key) &&
        key[0] === ACCOUNTING_SWR_KEYS.LIST_TRIAL_BALANCE_LINES &&
        typeof key[1] === "object" &&
        key[1] !== null &&
        (key[1] as Record<string, unknown>)["accountId"] === resolvedId,
    );
  };

  return (
    <div
      className={clsx(
        "grid motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
      role="region"
      id={`drill-${domId}`}
      aria-label={`Jurnal akun ${accountName}`}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="bg-primary-50/50">
          {displayState === "loading" && <TrialBalanceDrillLoading />}
          {displayState === "error" && <TrialBalanceDrillError onRetry={handleRetry} />}
          {displayState === "not-found" && (
            <div className="py-6 pl-14 pr-4 text-sm text-neutral-300">Akun tidak ditemukan.</div>
          )}
          {displayState === "empty" && <TrialBalanceDrillEmpty />}
          {displayState === "data" && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <caption className="sr-only">Jurnal akun {accountName}</caption>
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th
                        scope="col"
                        className="py-2 pl-14 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300"
                      >
                        Tanggal
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300"
                      >
                        Ref · Memo
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300"
                      >
                        Debit
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-4 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300"
                      >
                        Kredit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => {
                      const cps = counterpartMap.get(line.journalEntryId) ?? [];
                      const cpCodes = formatCounterpartCodes(cps);
                      const formattedDate = DateTime.fromISO(line.date).setLocale("id").toFormat("dd MMM yyyy");
                      return (
                        <tr key={line.id} className="border-b border-neutral-100 last:border-b-0">
                          <td className="whitespace-nowrap py-3 pl-14 pr-4 text-sm text-neutral-400">
                            {formattedDate}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="text-neutral-400">
                              {[line.referenceType, line.memo].filter(Boolean).join(" · ") || "—"}
                            </div>
                            {cpCodes && (
                              <div className="font-mono text-xs text-neutral-300">{cpCodes}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-sm tabular-nums text-neutral-400">
                            {line.debit > 0 ? line.debit.toLocaleString("id-ID") : "—"}
                          </td>
                          <td className="py-3 pl-4 pr-6 text-right text-sm tabular-nums text-neutral-400">
                            {line.credit > 0 ? line.credit.toLocaleString("id-ID") : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {meta && meta.totalPages > 1 && (
                <TablePagination
                  displayedCount={lines.length}
                  meta={meta}
                  currentPage={page}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
