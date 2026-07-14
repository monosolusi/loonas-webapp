"use client";

import { use } from "react";
import { RawMaterialDetailProvider } from "@/app/(authenticated)/settings/raw-materials/[id]/_providers/raw-material-detail-provider";
import { RawMaterialDetailLoading } from "@/app/(authenticated)/settings/raw-materials/[id]/_components/raw-material-detail-loading";
import { RawMaterialDetailHeader } from "@/app/(authenticated)/settings/raw-materials/[id]/_components/raw-material-detail-header";
import { RawMaterialDetailInfoCard } from "@/app/(authenticated)/settings/raw-materials/[id]/_components/raw-material-detail-info-card";
import { RawMaterialDetailStockCard } from "@/app/(authenticated)/settings/raw-materials/[id]/_components/raw-material-detail-stock-card";
import { RawMaterialDetailMovementCard } from "@/app/(authenticated)/settings/raw-materials/[id]/_components/raw-material-detail-movement-card";

type RawMaterialDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function RawMaterialDetailPage(props: RawMaterialDetailPageProps) {
  const { id } = use(props.params);

  return (
    <RawMaterialDetailProvider id={id} loading={<RawMaterialDetailLoading />}>
      <div className="flex flex-col gap-y-6">
        <RawMaterialDetailHeader />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6">
          <RawMaterialDetailInfoCard />
          <RawMaterialDetailStockCard />
        </div>
        <RawMaterialDetailMovementCard />
      </div>
    </RawMaterialDetailProvider>
  );
}
