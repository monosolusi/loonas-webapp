"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingLineEntity } from "@/features/accounting/domain/entities/coa-mapping-line";
import { CoaMappingSideColumn } from "@/app/(authenticated)/accounting/mappings/_components/coa-mapping-side-column";
import { useCoaMappings } from "@/app/(authenticated)/accounting/mappings/_providers/coa-mappings-provider";

const ROW_GRID = "grid-cols-[minmax(200px,_1.1fr)_2fr_2fr_48px]";

type CoaMappingRowProps = {
  mapping: CoaMappingEntity;
};

export function CoaMappingRow({ mapping }: CoaMappingRowProps) {
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
      <CoaMappingSideColumn lines={debits} accent="debit" />
      <CoaMappingSideColumn lines={credits} accent="credit" />
      <div className="flex justify-end pt-1">
        <ActionMenu options={menuOptions} />
      </div>
    </div>
  );
}
