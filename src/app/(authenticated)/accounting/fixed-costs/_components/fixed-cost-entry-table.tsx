"use client";

import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { useFixedCostEntries } from "@/app/(authenticated)/accounting/fixed-costs/_providers/fixed-cost-entries-provider";
import { FixedCostEntryRow } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-entry-row";

export function FixedCostEntryTable() {
  const { entries, total, loading } = useFixedCostEntries();

  return (
    <TableContainer
      loading={loading}
      empty={!loading && entries.length === 0}
      emptyMessage="Tidak ada data untuk bulan ini."
    >
      <TableHeader
        className="grid-cols-[1fr_1fr] gap-3 sm:grid-cols-[3fr_1.5fr] sm:gap-0"
        columns={[{ label: "Nama Biaya" }, { label: "Jumlah (per bulan)" }]}
      />

      {entries.map((entry) => (
        <FixedCostEntryRow key={entry.fixedCostId} entry={entry} />
      ))}

      <div className="grid grid-cols-[1fr_1fr] items-center gap-3 border-t border-neutral-100 bg-neutral-50 px-6 py-4 sm:grid-cols-[3fr_1.5fr] sm:gap-0">
        <span className="text-sm font-semibold text-neutral-500">Total</span>
        <span className="text-sm font-semibold text-neutral-500">{IDRFormatter.toCurrency(total)}</span>
      </div>
    </TableContainer>
  );
}
