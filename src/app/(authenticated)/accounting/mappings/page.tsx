"use client";

import { CoaMappingsProvider } from "@/app/(authenticated)/accounting/mappings/_providers/coa-mappings-provider";
import { CoaMappingsHeader } from "@/app/(authenticated)/accounting/mappings/_components/coa-mappings-header";
import { CoaMappingsTable } from "@/app/(authenticated)/accounting/mappings/_components/coa-mappings-table";
import { CoaMappingCreateDialog } from "@/app/(authenticated)/accounting/mappings/_components/coa-mapping-create-dialog";
import { CoaMappingEditDialog } from "@/app/(authenticated)/accounting/mappings/_components/coa-mapping-edit-dialog";
import { CoaMappingDeleteDialog } from "@/app/(authenticated)/accounting/mappings/_components/coa-mapping-delete-dialog";

export default function CoaMappingsPage() {
  return (
    <CoaMappingsProvider>
      <div className="flex flex-col gap-y-6">
        <CoaMappingsHeader />
        <CoaMappingsTable />
      </div>
      <CoaMappingCreateDialog />
      <CoaMappingEditDialog />
      <CoaMappingDeleteDialog />
    </CoaMappingsProvider>
  );
}
