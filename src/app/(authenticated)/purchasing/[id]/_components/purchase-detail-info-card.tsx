"use client";

import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { usePurchaseDetail } from "@/app/(authenticated)/purchasing/[id]/_providers/purchase-detail-provider";

export function PurchaseDetailInfoCard() {
  const { purchase } = usePurchaseDetail();

  return (
    <SectionCard title="Informasi" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Tanggal</span>
          <span className="text-sm font-medium text-neutral-500">
            {DateTime.fromISO(purchase.date).toFormat("dd MMM yyyy")}
          </span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Catatan</span>
          <span className="text-sm font-medium text-neutral-500">{purchase.note ?? "—"}</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Dibuat</span>
          <span className="text-sm text-neutral-400">
            {DateTime.fromISO(purchase.createdAt).toFormat("dd MMM yyyy")}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
