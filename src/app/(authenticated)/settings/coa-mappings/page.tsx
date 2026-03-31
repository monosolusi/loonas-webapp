"use client";

import { CoaMappingsProvider } from "@/app/(authenticated)/settings/coa-mappings/_providers/coa-mappings-provider";
import { CoaMappingsHeader } from "@/app/(authenticated)/settings/coa-mappings/_components/coa-mappings-header";
import { CoaMappingsTable } from "@/app/(authenticated)/settings/coa-mappings/_components/coa-mappings-table";

export default function CoaMappingsPage() {
  return (
    <CoaMappingsProvider>
      <div className="flex flex-col gap-y-6">
        <CoaMappingsHeader />
        <CoaMappingsTable />
      </div>
    </CoaMappingsProvider>
  );
}
