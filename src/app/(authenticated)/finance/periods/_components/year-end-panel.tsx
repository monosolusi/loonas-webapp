"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { YearEndJournalReference } from "@/app/(authenticated)/finance/periods/_components/year-end-journal-reference";
import { YearEndReopenLink } from "@/app/(authenticated)/finance/periods/_components/year-end-reopen-link";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";

const CURRENT_YEAR = DateTime.now().year;
const SELECTABLE_YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export function YearEndPanel() {
  const { selectedYear, setSelectedYear, yearSummary, yearSummaryLoading, openCloseYearDialog, reopenedReversalJournalId } =
    usePeriods();

  const isLocked = useMemo(() => yearSummary?.locked ?? false, [yearSummary]);

  if (yearSummaryLoading) {
    return (
      <SectionCard title="Tutup Tahun Buku">
        <div className="flex animate-pulse flex-col gap-y-3">
          <div className="h-4 w-32 rounded bg-neutral-100" />
          <div className="h-9 w-48 rounded bg-neutral-100" />
          <div className="h-10 w-36 rounded bg-neutral-100" />
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Tutup Tahun Buku">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex flex-col gap-y-1.5">
            <label htmlFor="year-select" className="text-sm font-medium text-neutral-500">
              Tahun buku
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="h-11 rounded-lg border border-neutral-100 px-3 text-sm text-neutral-500 focus:border-primary-300 focus:outline-none"
            >
              {SELECTABLE_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-y-1.5">
            <span className="text-sm font-medium text-neutral-500">Status</span>
            <div className="flex h-11 items-center">
              {isLocked ? (
                <StatusChip label="Tahun terkunci" variant="success" />
              ) : (
                <StatusChip label="Tahun terbuka" variant="neutral" />
              )}
            </div>
          </div>
        </div>

        {!isLocked && (
          <div className="flex flex-col gap-y-3">
            <p className="text-sm text-neutral-400">
              Tutup tahun buku untuk memposting jurnal penutup dan menggulung laba/rugi bersih ke akun Saldo Laba
              Ditahan. Setelah ditutup, hanya admin yang dapat membuka kembali.
            </p>
            <PrimaryButton
              label="Tutup Tahun Buku"
              onClick={openCloseYearDialog}
              type="button"
            />
            {reopenedReversalJournalId && (
              <YearEndJournalReference
                label="Jurnal pembalik:"
                closeJournalId={reopenedReversalJournalId}
                closingJournalCreatedAt={null}
              />
            )}
          </div>
        )}

        {isLocked && yearSummary && (
          <div className="flex flex-col gap-y-3">
            <YearEndJournalReference
              closeJournalId={yearSummary.closeJournalId}
              closingJournalCreatedAt={yearSummary.closingJournalCreatedAt}
            />
            {yearSummary.canUnlock && <YearEndReopenLink />}
          </div>
        )}
      </div>
    </SectionCard>
  );
}
