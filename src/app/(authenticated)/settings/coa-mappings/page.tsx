"use client";

import { CoaMappingsProvider } from "@/app/(authenticated)/settings/coa-mappings/_providers/coa-mappings-provider";
import { CoaMappingsHeader } from "@/app/(authenticated)/settings/coa-mappings/_components/coa-mappings-header";
import { CoaMappingsContent } from "@/app/(authenticated)/settings/coa-mappings/_components/coa-mappings-content";
import { CoaMappingEditDialog } from "@/app/(authenticated)/settings/coa-mappings/_components/coa-mapping-edit-dialog";
import { CoaMappingDeleteDialog } from "@/app/(authenticated)/settings/coa-mappings/_components/coa-mapping-delete-dialog";

export default function CoaMappingsPage() {
  return (
    <CoaMappingsProvider>
      <div className="flex flex-col gap-y-6">
        <CoaMappingsHeader />
        <CoaMappingsContent />
      </div>
      <CoaMappingEditDialog />
      <CoaMappingDeleteDialog />
    </CoaMappingsProvider>
  );
}
