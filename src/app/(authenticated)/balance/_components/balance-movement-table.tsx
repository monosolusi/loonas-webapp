"use client";

import { useState } from "react";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { useListBalanceMovements } from "@/features/balance/presentations/hooks/use-list-balance-movements";
import { BalanceMovementRow, GRID_TEMPLATE } from "@/app/(authenticated)/balance/_components/balance-movement-row";

export function BalanceMovementTable() {
  const [page, setPage] = useState(1);
  const { movements, meta, loading, error } = useListBalanceMovements({ page, limit: DEFAULT_PAGE_SIZE });

  return (
    <TableContainer
      loading={loading}
      error={error !== null}
      empty={(movements ?? []).length === 0 && !loading}
      emptyMessage="Belum ada mutasi saldo."
    >
      <TableHeader
        columns={[
          { label: "Tanggal" },
          { label: "Arah" },
          { label: "Jumlah" },
          { label: "Transaksi Penyebab" },
          { label: "Koreksi" },
        ]}
        className={GRID_TEMPLATE}
        hideOnMobile
      />
      {(movements ?? []).map((movement) => (
        <BalanceMovementRow key={movement.id} movement={movement} />
      ))}
      {meta && meta.totalPages > 1 && (
        <TablePagination
          displayedCount={(movements ?? []).length}
          meta={meta}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </TableContainer>
  );
}
