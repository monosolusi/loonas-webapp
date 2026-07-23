"use client";

import { useCallback, useRef } from "react";
import clsx from "clsx";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { BalanceDisplay } from "@/features/accounting/presentations/components/reports/balance-display";
import { TrialBalanceDrillPanel } from "@/features/accounting/presentations/components/reports/trial-balance-drill-panel";
import { TrialBalanceRowEntity } from "@/features/accounting/domain/entities/trial-balance";

export type NeracaSaldoAccountRowProps = {
  readonly row: TrialBalanceRowEntity;
  readonly isExpanded: boolean;
  readonly onToggle: (id: string) => void;
  readonly includeZero: boolean;
  readonly fiscalYearStart: string;
  readonly asOf: string;
};

export function NeracaSaldoAccountRow({
  row,
  isExpanded,
  onToggle,
  includeZero,
  fiscalYearStart,
  asOf,
}: NeracaSaldoAccountRowProps) {
  const isZero = row.closingDebit === 0 && row.closingCredit === 0;
  const rowRef = useRef<HTMLTableRowElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle(row.id);
      } else if (e.key === "Escape" && isExpanded) {
        e.preventDefault();
        onToggle(row.id);
        rowRef.current?.focus();
      }
    },
    [row.id, isExpanded, onToggle],
  );

  return (
    <>
      <tr
        ref={rowRef}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`drill-${row.id}`}
        aria-label={`Lihat jurnal akun ${row.accountName}`}
        onClick={() => onToggle(row.id)}
        onKeyDown={handleKeyDown}
        className={clsx(
          "cursor-pointer border-b border-neutral-100 last:border-b-0",
          "hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-300",
          isExpanded && "bg-primary-50",
          isZero && includeZero && "text-neutral-300",
        )}
      >
        <td className="w-10 px-3 py-3">
          <ChevronRightIcon
            className={clsx(
              "size-4 text-neutral-300 transition-transform motion-safe:duration-150",
              isExpanded && "rotate-90",
            )}
            aria-hidden="true"
          />
        </td>
        <td className="py-3 pr-3 font-mono text-sm text-neutral-400">{row.accountCode}</td>
        <td className="py-3 pr-4 text-sm">{row.accountName}</td>
        <td className="py-3 pr-4 text-right text-sm tabular-nums">
          {row.naturalSide === "debit" ? (
            row.closingDebit > 0 ? (
              <BalanceDisplay value={row.closingDebit} />
            ) : (
              <span className="text-neutral-300">—</span>
            )
          ) : (
            <span className="text-neutral-300">—</span>
          )}
        </td>
        <td className="py-3 pr-6 text-right text-sm tabular-nums">
          {row.naturalSide === "credit" ? (
            row.closingCredit > 0 ? (
              <BalanceDisplay value={row.closingCredit} />
            ) : (
              <span className="text-neutral-300">—</span>
            )
          ) : (
            <span className="text-neutral-300">—</span>
          )}
        </td>
      </tr>
      <tr>
        <td colSpan={5} className="p-0">
          <TrialBalanceDrillPanel
            domId={row.id}
            accountCode={row.accountCode}
            accountName={row.accountName}
            from={fiscalYearStart}
            to={asOf}
            isOpen={isExpanded}
          />
        </td>
      </tr>
    </>
  );
}
