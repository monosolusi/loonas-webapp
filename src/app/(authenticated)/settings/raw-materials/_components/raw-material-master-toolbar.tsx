"use client";

import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import {
  useRawMaterialMaster
} from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";

export function RawMaterialMasterToolbar() {
  const { search, setSearch } = useRawMaterialMaster();

  return (
    <TableToolbar>
      <TableSearch value={search} onChange={setSearch} placeholder="Cari bahan baku..." />
    </TableToolbar>
  );
}
