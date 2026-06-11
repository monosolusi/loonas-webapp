"use client";

import { useMemo } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { useListLowStockItems } from "@/features/inventory/presentations/hooks/use-list-low-stock-items";
import { DashboardLowStockCardLoading } from "@/app/(authenticated)/home/_components/dashboard-low-stock-card-loading";
import { DashboardLowStockCardError } from "@/app/(authenticated)/home/_components/dashboard-low-stock-card-error";
import { DashboardLowStockCardEmpty } from "@/app/(authenticated)/home/_components/dashboard-low-stock-card-empty";
import { DashboardLowStockRow } from "@/app/(authenticated)/home/_components/dashboard-low-stock-row";

export function DashboardLowStockCard() {
  const { stockItems, loading, error } = useListLowStockItems({ limit: 5 });

  const sortedItems = useMemo(() => {
    if (!stockItems) return [];
    return [...stockItems]
      .sort((a, b) => {
        const aDiff = a.currentStock - (a.minStock ?? 0);
        const bDiff = b.currentStock - (b.minStock ?? 0);
        return aDiff - bDiff;
      })
      .slice(0, 5);
  }, [stockItems]);

  if (loading) {
    return <DashboardLowStockCardLoading />;
  }

  if (error) {
    return <DashboardLowStockCardError />;
  }

  if (sortedItems.length === 0) {
    return <DashboardLowStockCardEmpty />;
  }

  return (
    <SectionCard title="Stok Menipis" bodyClassName="p-0">
      {sortedItems.map((item) => (
        <DashboardLowStockRow key={item.id} stockItem={item} />
      ))}
    </SectionCard>
  );
}
