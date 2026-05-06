"use client";

import { useRouter } from "next/navigation";
import { PosSalesList } from "@/features/pos/presentations/components/pos-sales-list";

export default function PosSalesHistoryPage() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col gap-y-4 p-6">
      <div className="flex flex-row items-baseline justify-between">
        <h1 className="text-lg font-semibold text-neutral-500">Riwayat Penjualan</h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <PosSalesList onSelectSale={(id) => router.push(`/pos/receipt/${id}`)} />
      </div>
    </div>
  );
}
