"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { SummaryCard } from "@/core/presentations/components/summary-card";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { BukuBesarNoAccountPrompt } from "@/features/accounting/presentations/components/reports/buku-besar-no-account-prompt";
import { BukuBesarLinesTable } from "@/features/accounting/presentations/components/reports/buku-besar-lines-table";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import {
  GeneralLedgerCounterpartEntity,
  GeneralLedgerSummaryEntity,
  GeneralLedgerReportEntity,
} from "@/features/accounting/domain/entities/general-ledger";
import { PaginationMeta } from "@/core/resources/paginated";

type BukuBesarViewerProps = {
  account: LedgerAccountEntity | null;
  onAccountChange: (account: LedgerAccountEntity | null) => void;
  report: GeneralLedgerReportEntity | null;
  summary: GeneralLedgerSummaryEntity | null;
  counterpartMap: Map<string, GeneralLedgerCounterpartEntity[]>;
  meta: PaginationMeta | null;
  page: number;
  onPageChange: (page: number) => void;
  isInitialLoading: boolean;
  pageError: { message?: string } | null;
  onRetry: () => void;
};

export function BukuBesarViewer({
  account,
  onAccountChange,
  report,
  summary,
  counterpartMap,
  meta,
  page,
  onPageChange,
  isInitialLoading,
  pageError,
  onRetry,
}: BukuBesarViewerProps) {
  const summaryCards = useMemo(
    () => [
      {
        label: "Saldo Awal",
        value: summary ? IDRFormatter.toCurrency(summary.openingBalance) : "—",
        variant: "neutral" as const,
      },
      {
        label: "Mutasi Debit",
        value: summary ? IDRFormatter.toCurrency(summary.periodDebitTotal) : "—",
        variant: "neutral" as const,
      },
      {
        label: "Mutasi Kredit",
        value: summary ? IDRFormatter.toCurrency(summary.periodCreditTotal) : "—",
        variant: "neutral" as const,
      },
      {
        label: "Saldo Akhir",
        value: summary ? IDRFormatter.toCurrency(summary.closingBalance) : "—",
        variant: "primary" as const,
      },
    ],
    [summary],
  );

  if (!account) {
    return <BukuBesarNoAccountPrompt account={account} onAccountChange={onAccountChange} />;
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-neutral-100 px-6 py-4">
        <div className="w-full max-w-sm">
          <LedgerAccountCombobox
            value={account}
            onChange={onAccountChange}
            label="Akun"
            placeholder="Cari kode atau nama akun..."
          />
        </div>
      </div>

      <div className={clsx("grid gap-4 p-6", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4")}>
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            variant={card.variant}
            loading={isInitialLoading}
          />
        ))}
      </div>

      {report?.meta.truncated && (
        <div className="mx-6 mb-4 rounded-lg border border-warning-400 bg-warning-50 px-4 py-2 text-sm text-warning-500">
          Hasil dibatasi {report.meta.lineCap} baris.
        </div>
      )}

      {pageError && (
        <div className="mx-6 mb-4 flex flex-row items-center gap-x-2 rounded-lg border border-error-300 bg-error-50 px-4 py-2 text-sm text-error-400">
          <span>Gagal memuat halaman ini.</span>
          <button type="button" onClick={onRetry} className="font-medium underline hover:no-underline">
            Muat ulang
          </button>
        </div>
      )}

      <BukuBesarLinesTable
        lines={report?.lines ?? []}
        counterpartMap={counterpartMap}
        meta={meta}
        page={page}
        onPageChange={onPageChange}
      />
    </div>
  );
}
