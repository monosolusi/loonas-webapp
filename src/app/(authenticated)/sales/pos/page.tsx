"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { PosSalesRangeProvider } from "@/app/(authenticated)/sales/pos/_providers/pos-sales-range-provider";
import { PosSalesListProvider } from "@/app/(authenticated)/sales/pos/_providers/pos-sales-list-provider";
import { PosSalesListToolbar } from "@/app/(authenticated)/sales/pos/_components/pos-sales-list-toolbar";
import { PosSalesListTable } from "@/app/(authenticated)/sales/pos/_components/pos-sales-list-table";

export default function ChromePosSalesHistoryPage() {
  const router = useRouter();

  return (
    <Suspense>
      <PosSalesRangeProvider>
        <PosSalesListProvider>
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-1">
              <h1 className="text-xl font-semibold text-neutral-500">Riwayat POS</h1>
              <p className="text-sm text-neutral-400">Semua transaksi POS yang telah selesai.</p>
            </div>
            <PosSalesListToolbar />
            <PosSalesListTable onSelectSale={(id) => router.push(`/sales/pos/${id}`)} />
          </div>
        </PosSalesListProvider>
      </PosSalesRangeProvider>
    </Suspense>
  );
}