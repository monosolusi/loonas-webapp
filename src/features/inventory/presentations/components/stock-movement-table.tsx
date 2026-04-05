"use client";

import { useListStockMovements } from "@/features/inventory/presentations/hooks/use-list-stock-movements";
import { StockMovementRow } from "@/features/inventory/presentations/components/stock-movement-row";

type StockMovementTableProps = {
  stockItemId: string;
  limit?: number;
};

export function StockMovementTable({ stockItemId, limit = 10 }: StockMovementTableProps) {
  const { movements, loading } = useListStockMovements({ stockItemId, limit });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-sm text-neutral-300">Memuat...</span>
      </div>
    );
  }

  if (!movements || movements.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-sm text-neutral-300">Belum ada pergerakan stok</span>
      </div>
    );
  }

  return (
    <>
      {movements.map((movement) => (
        <StockMovementRow key={movement.id} movement={movement} />
      ))}
    </>
  );
}
