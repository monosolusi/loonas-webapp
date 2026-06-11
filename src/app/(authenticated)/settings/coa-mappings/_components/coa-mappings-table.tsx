"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingLineEntity } from "@/features/accounting/domain/entities/coa-mapping-line";
import { useCoaMappings } from "@/app/(authenticated)/settings/coa-mappings/_providers/coa-mappings-provider";

const ROW_GRID = "grid-cols-[minmax(200px,_1.1fr)_2fr_2fr_48px]";

function LineItem({ line }: { line: CoaMappingLineEntity }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-x-2">
        <span className="text-primary-500 font-mono text-sm font-semibold tracking-tight">
          {line.account.code}
        </span>
        <span className="truncate text-sm text-neutral-400">{line.account.name}</span>
      </div>
      {line.label && <span className="text-xs text-neutral-300 italic">{line.label}</span>}
    </div>
  );
}

function EmptySide() {
  return <span className="text-sm text-neutral-200 italic">—</span>;
}

type SideColumnProps = {
  lines: CoaMappingLineEntity[];
  accent: "debit" | "credit";
};

function SideColumn({ lines, accent }: SideColumnProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-y-3 border-l-2 pl-4",
        accent === "debit" ? "border-primary-200" : "border-warning-200",
      )}
    >
      {lines.length > 0 ? lines.map((line) => <LineItem key={line.id} line={line} />) : <EmptySide />}
    </div>
  );
}

function CoaMappingRow({ mapping }: { mapping: CoaMappingEntity }) {
  const { entityTypes, setEditingItem, setDeletingItem } = useCoaMappings();

  const entityTypeLabel = useMemo(
    () => entityTypes.find((t) => t.type === mapping.entityType)?.label ?? mapping.entityType,
    [entityTypes, mapping.entityType],
  );

  const { debits, credits } = useMemo(() => {
    const d: CoaMappingLineEntity[] = [];
    const c: CoaMappingLineEntity[] = [];
    for (const line of mapping.lines) {
      if (line.position === "debit") d.push(line);
      else c.push(line);
    }
    return { debits: d, credits: c };
  }, [mapping.lines]);

  const menuOptions = useMemo<ActionMenuOption[]>(
    () => [
      { label: "Ubah", onClick: () => setEditingItem(mapping) },
      { label: "Hapus", onClick: () => setDeletingItem(mapping), variant: "danger" },
    ],
    [mapping, setEditingItem, setDeletingItem],
  );

  return (
    <div
      className={clsx(
        "grid",
        ROW_GRID,
        "items-start gap-x-6 border-b border-neutral-100 px-6 py-5 transition-colors last:border-b-0 hover:bg-neutral-50/40",
      )}
    >
      <div className="flex flex-col justify-center gap-y-1 pt-1">
        <span className="text-sm font-semibold text-neutral-500">{entityTypeLabel}</span>
      </div>

      <SideColumn lines={debits} accent="debit" />

      <SideColumn lines={credits} accent="credit" />

      <div className="flex justify-end pt-1">
        <ActionMenu options={menuOptions} />
      </div>
    </div>
  );
}

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
    >
      <TableHeaderRow />
      {mappings?.map((mapping) => <CoaMappingRow key={mapping.id} mapping={mapping} />)}
    </TableContainer>
  );
}
