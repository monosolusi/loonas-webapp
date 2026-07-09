"use client";

import { useState } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { useListAccountSettingAudit } from "@/features/accounting/presentations/hooks/use-list-account-setting-audit";
import { TaxPostureHistoryRow } from "@/app/(authenticated)/settings/tax-posture/_components/tax-posture-history-row";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";

export function TaxPostureHistoryCard() {
  const [page, setPage] = useState(1);
  const result = useListAccountSettingAudit({ page, limit: DEFAULT_PAGE_SIZE });

  const isLoading = result.loading;
  const isError = !isLoading && result.error !== null;
  const audits = !isLoading && !isError ? result.data?.data ?? [] : [];
  const meta = !isLoading && !isError ? result.data?.meta ?? null : null;

  return (
    <SectionCard title="Riwayat Perubahan">
      <TableContainer
        loading={isLoading}
        error={isError}
        empty={!isLoading && !isError && audits.length === 0}
        emptyMessage="Belum ada perubahan."
      >
        {/* Table header row */}
        <div className="grid grid-cols-[1fr_auto] items-center border-b border-neutral-100 bg-neutral-50/60 px-6 py-3">
          <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            Waktu &amp; Perubahan
          </span>
          <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Peran</span>
        </div>

        {audits.map((audit) => (
          <TaxPostureHistoryRow key={audit.id} audit={audit} />
        ))}

        {meta && meta.totalPages > 1 && (
          <TablePagination
            displayedCount={audits.length}
            meta={meta}
            currentPage={page}
            onPageChange={setPage}
            countLabel="perubahan"
          />
        )}
      </TableContainer>
    </SectionCard>
  );
}
