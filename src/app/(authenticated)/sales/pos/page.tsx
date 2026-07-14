"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { PosSalesRangeProvider } from "@/app/(authenticated)/sales/pos/_providers/pos-sales-range-provider";
import { PosSalesListProvider } from "@/app/(authenticated)/sales/pos/_providers/pos-sales-list-provider";
import { PosSalesListToolbar } from "@/app/(authenticated)/sales/pos/_components/pos-sales-list-toolbar";
import { PosSalesListTable } from "@/app/(authenticated)/sales/pos/_components/pos-sales-list-table";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";

export default function ChromePosSalesHistoryPage() {
  const router = useRouter();

  return (
    <Suspense>
      <PosSalesRangeProvider>
        <PosSalesListProvider>
          <div className="flex flex-col gap-y-6">
            <ListPageHeader title="Riwayat POS" subtitle="Semua transaksi POS yang telah selesai." />
            <PosSalesListToolbar />
            <PosSalesListTable onSelectSale={(id) => router.push(`/sales/pos/${id}`)} />
          </div>
        </PosSalesListProvider>
      </PosSalesRangeProvider>
    </Suspense>
  );
}