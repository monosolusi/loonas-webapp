"use client";

import { use } from "react";
import { ProductionDetailProvider } from "@/app/(authenticated)/productions/[id]/_providers/production-detail-provider";
import { ProductionDetailLoading } from "@/app/(authenticated)/productions/[id]/_components/production-detail-loading";
import { ProductionDetailHeader } from "@/app/(authenticated)/productions/[id]/_components/production-detail-header";
import { ProductionDetailInfoCard } from "@/app/(authenticated)/productions/[id]/_components/production-detail-info-card";
import { ProductionDetailCostCard } from "@/app/(authenticated)/productions/[id]/_components/production-detail-cost-card";
import { ProductionDetailItemsCard } from "@/app/(authenticated)/productions/[id]/_components/production-detail-items-card";

type ProductionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function ProductionDetailPage(props: ProductionDetailPageProps) {
  const { id } = use(props.params);

  return (
    <ProductionDetailProvider id={id} loading={<ProductionDetailLoading />}>
      <div className="flex flex-col gap-y-6">
        <ProductionDetailHeader />
        <div className="grid grid-cols-2 gap-x-6">
          <ProductionDetailInfoCard />
          <ProductionDetailCostCard />
        </div>
        <ProductionDetailItemsCard />
      </div>
    </ProductionDetailProvider>
  );
}
