"use client";

import { useCoaMappings } from "@/app/(authenticated)/settings/coa-mappings/_providers/coa-mappings-provider";
import { CoaMappingsSection } from "@/app/(authenticated)/settings/coa-mappings/_components/coa-mappings-section";

export function CoaMappingsContent() {
  const { entityTypes, groupedMappings, loading } = useCoaMappings();

  if (loading) {
    return (
      <div className="flex flex-col gap-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (entityTypes.length === 0) {
    return <p className="text-sm text-neutral-300">Tidak ada data pemetaan akun.</p>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      {entityTypes.map((entityType) => (
        <CoaMappingsSection
          key={entityType.type}
          entityType={entityType}
          mappings={groupedMappings[entityType.type] ?? []}
        />
      ))}
    </div>
  );
}
