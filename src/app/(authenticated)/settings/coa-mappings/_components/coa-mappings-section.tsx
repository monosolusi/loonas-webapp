"use client";

import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingEntityTypeEntity } from "@/features/accounting/domain/entities/coa-mapping-entity-type";
import { CoaMappingRow } from "@/app/(authenticated)/settings/coa-mappings/_components/coa-mapping-row";

type CoaMappingsSectionProps = {
  entityType: CoaMappingEntityTypeEntity;
  mappings: CoaMappingEntity[];
};

export function CoaMappingsSection({ entityType, mappings }: CoaMappingsSectionProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-neutral-500">{entityType.label}</h3>
        <p className="text-xs text-neutral-200">{entityType.description}</p>
      </div>
      <TableContainer empty={mappings.length === 0} emptyMessage="Belum ada pemetaan akun untuk jenis transaksi ini.">
        <TableHeader
          className="grid-cols-3"
          columns={[{ label: "Konteks" }, { label: "Akun Debit" }, { label: "Akun Kredit" }]}
        />
        {mappings.map((mapping) => (
          <CoaMappingRow key={mapping.id} mapping={mapping} />
        ))}
      </TableContainer>
    </div>
  );
}
