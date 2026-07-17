"use client";

import { ReactNode } from "react";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

type ReportStatementMastheadProps = {
  // Formal statement title per SAK EMKM, e.g. "Laporan Posisi Keuangan (Neraca)".
  readonly title: string;
  // Period line, e.g. "Per 31 Desember 2025" or "Periode 1 Jan 2025 – 31 Des 2025".
  readonly periodLabel: string;
  readonly action?: ReactNode;
};

// The "kop laporan" — the masthead that turns a data table into a formal financial
// statement: entity name, statement title, period, and presentation currency, centered
// the way an accountant, bank, or tax office expects to read it.
export function ReportStatementMasthead({ title, periodLabel, action }: ReportStatementMastheadProps) {
  const { account, loading } = useGetCurrentAccount();
  const entityName = account?.fullName ?? "";

  return (
    <div className="relative border-b border-neutral-100 px-6 py-5">
      {action && <div className="absolute right-4 top-4">{action}</div>}

      <div className="flex flex-col items-center gap-y-0.5 text-center">
        {loading ? (
          <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" aria-hidden="true" />
        ) : (
          entityName && (
            <p className="text-sm font-bold uppercase tracking-wide text-neutral-500">{entityName}</p>
          )
        )}

        <h2 className="text-base font-semibold text-neutral-500">{title}</h2>
        <p className="text-sm text-neutral-300">{periodLabel}</p>
        <p className="mt-1 text-xs text-neutral-300">(Dinyatakan dalam Rupiah)</p>
      </div>
    </div>
  );
}
