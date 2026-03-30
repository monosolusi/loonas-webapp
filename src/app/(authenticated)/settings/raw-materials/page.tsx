"use client";

import { RawMaterialMasterProvider } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";
import { RawMaterialMasterHeader } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-master-header";
import { RawMaterialMasterToolbar } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-master-toolbar";
import { RawMaterialMasterTable } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-master-table";

export default function RawMaterialsPage() {
  return (
    <RawMaterialMasterProvider>
      <div className="flex flex-col gap-y-6">
        <RawMaterialMasterHeader />
        <RawMaterialMasterToolbar />
        <RawMaterialMasterTable />
      </div>
    </RawMaterialMasterProvider>
  );
}
