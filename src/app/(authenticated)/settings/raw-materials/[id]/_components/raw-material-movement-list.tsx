"use client";

import { useListStockMovements } from "@/features/inventory/presentations/hooks/use-list-stock-movements";
import { RawMaterialMovementRow } from "@/app/(authenticated)/settings/raw-materials/[id]/_components/raw-material-movement-row";

type RawMaterialMovementListProps = {
  stockItemId: string;
};

export function RawMaterialMovementList({ stockItemId }: RawMaterialMovementListProps) {
  const { movements, loading } = useListStockMovements({ stockItemId, limit: 10 });

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
        <RawMaterialMovementRow key={movement.id} movement={movement} />
      ))}
    </>
  );
}
