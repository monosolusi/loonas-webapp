"use client";

import { useRouter } from "next/navigation";
import { PosSalesList } from "@/features/pos/presentations/components/pos-sales-list";

export default function ChromePosSalesHistoryPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-xl font-semibold text-neutral-500">Riwayat POS</h1>
        <p className="text-sm text-neutral-400">Semua transaksi POS yang telah selesai.</p>
      </div>
      <PosSalesList onSelectSale={(id) => router.push(`/sales/pos/${id}`)} />
    </div>
  );
}
