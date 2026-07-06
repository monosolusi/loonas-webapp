"use client";

import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { useProfitabilityDashboard } from "@/app/(authenticated)/finance/profitability/_providers/profitability-dashboard-provider";

export function ProfitabilityListToolbar() {
  const { search, setSearch } = useProfitabilityDashboard();

  return (
    <TableToolbar>
      <TableSearch
        value={search}
        onChange={setSearch}
        placeholder="Cari produk atau varian..."
      />
    </TableToolbar>
  );
}
