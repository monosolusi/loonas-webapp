"use client";

import { use } from "react";
import { PurchaseDetailProvider } from "@/app/(authenticated)/purchasing/[id]/_providers/purchase-detail-provider";
import { PurchaseDetailLoading } from "@/app/(authenticated)/purchasing/[id]/_components/purchase-detail-loading";
import { PurchaseDetailHeader } from "@/app/(authenticated)/purchasing/[id]/_components/purchase-detail-header";
import { PurchaseDetailInfoCard } from "@/app/(authenticated)/purchasing/[id]/_components/purchase-detail-info-card";
import { PurchaseDetailSummaryCard } from "@/app/(authenticated)/purchasing/[id]/_components/purchase-detail-summary-card";
import { PurchaseDetailItemsCard } from "@/app/(authenticated)/purchasing/[id]/_components/purchase-detail-items-card";

type PurchaseDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function PurchaseDetailPage(props: PurchaseDetailPageProps) {
  const { id } = use(props.params);

  return (
    <PurchaseDetailProvider id={id} loading={<PurchaseDetailLoading />}>
      <div className="flex flex-col gap-y-6">
        <PurchaseDetailHeader />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-6">
          <PurchaseDetailInfoCard />
          <PurchaseDetailSummaryCard />
        </div>
        <PurchaseDetailItemsCard />
      </div>
    </PurchaseDetailProvider>
  );
}
