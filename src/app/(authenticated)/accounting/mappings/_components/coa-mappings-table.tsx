"use client";

import clsx from "clsx";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { CoaMappingRow } from "@/app/(authenticated)/accounting/mappings/_components/coa-mapping-row";
import { useCoaMappings } from "@/app/(authenticated)/accounting/mappings/_providers/coa-mappings-provider";

const ROW_GRID = "grid-cols-[minmax(200px,_1.1fr)_2fr_2fr_48px]";

function TableHeaderRow() {
  return (
    <div
      className={clsx(
        "grid",
        ROW_GRID,
        "items-center gap-x-6 border-b border-neutral-100 bg-neutral-50/60 px-6 py-3",
      )}
    >
      <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Jenis Transaksi</span>
      <div className="border-primary-300 flex items-center gap-x-2 border-l-2 pl-4">
        <span className="bg-primary-300 size-1.5 rounded-full" />
        <span className="text-primary-500 text-xs font-semibold tracking-[0.12em] uppercase">Debit</span>
      </div>
      <div className="border-warning-300 flex items-center gap-x-2 border-l-2 pl-4">
        <span className="bg-warning-300 size-1.5 rounded-full" />
        <span className="text-warning-500 text-xs font-semibold tracking-[0.12em] uppercase">Kredit</span>
      </div>
      <span />
    </div>
  );
}

export function CoaMappingsTable() {
  const { mappings, loading } = useCoaMappings();

  return (
    <TableContainer
      loading={loading}
      empty={!loading && (!mappings || mappings.length === 0)}
      emptyMessage="Belum ada pemetaan akun."
      scrollable
    >
      <div className="min-w-[820px]">
        <TableHeaderRow />
        {mappings?.map((mapping) => <CoaMappingRow key={mapping.id} mapping={mapping} />)}
      </div>
    </TableContainer>
  );
}
