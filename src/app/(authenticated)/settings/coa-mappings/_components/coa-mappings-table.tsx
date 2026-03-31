"use client";

import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { useCoaMappings } from "@/app/(authenticated)/settings/coa-mappings/_providers/coa-mappings-provider";

function formatAccount(account: { code: string; name: string }): string {
  return `${account.code} ${account.name}`;
}

function getEntityTypeLabel(entityType: string, entityTypes: { type: string; label: string }[]): string {
  return entityTypes.find((et) => et.type === entityType)?.label ?? entityType;
}

function CoaMappingRow({ mapping }: { mapping: CoaMappingEntity }) {
  const { entityTypes } = useCoaMappings();

  return (
    <div className="grid grid-cols-4 items-center border-b border-neutral-100 px-6 py-4 last:border-b-0">
      <span className="text-sm font-medium text-neutral-500">
        {getEntityTypeLabel(mapping.entityType, entityTypes)}
      </span>

      <span className="text-sm text-neutral-500">{mapping.entityId ?? "Default"}</span>

      <span className="truncate text-sm text-neutral-500">{formatAccount(mapping.debitAccount)}</span>

      <span className="truncate text-sm text-neutral-500">{formatAccount(mapping.creditAccount)}</span>
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
      <TableHeader
        className="grid-cols-4"
        columns={[
          { label: "Jenis Transaksi" },
          { label: "Konteks" },
          { label: "Akun Debit" },
          { label: "Akun Kredit" },
        ]}
      />
      {mappings?.map((mapping) => <CoaMappingRow key={mapping.id} mapping={mapping} />)}
    </TableContainer>
  );
}
