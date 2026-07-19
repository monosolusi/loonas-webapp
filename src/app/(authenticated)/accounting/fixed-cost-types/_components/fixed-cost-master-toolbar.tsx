"use client";

import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { useFixedCostMaster } from "@/app/(authenticated)/accounting/fixed-cost-types/_providers/fixed-cost-master-provider";

export function FixedCostMasterToolbar() {
  const { search, setSearch } = useFixedCostMaster();

  return (
    <TableToolbar>
      <TableSearch value={search} onChange={setSearch} placeholder="Cari biaya tetap..." />
    </TableToolbar>
  );
}
