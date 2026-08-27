"use client";

import { use } from "react";
import { CashEntryFeatureGate } from "@/app/(authenticated)/accounting/_components/cash-entry-feature-gate";
import { CashEntryDetailProvider } from "@/app/(authenticated)/accounting/cash-entries/[id]/_providers/cash-entry-detail-provider";
import { CashEntryDetailSkeleton } from "@/app/(authenticated)/accounting/cash-entries/[id]/_components/cash-entry-detail-skeleton";
import { CashEntryDetailHeader } from "@/app/(authenticated)/accounting/cash-entries/[id]/_components/cash-entry-detail-header";
import { CashEntryDetailInfoCard } from "@/app/(authenticated)/accounting/cash-entries/[id]/_components/cash-entry-detail-info-card";
import { CashEntryCancellationStatusCard } from "@/app/(authenticated)/accounting/cash-entries/[id]/_components/cash-entry-cancellation-status-card";
import { CashEntryCancelDialog } from "@/app/(authenticated)/accounting/cash-entries/[id]/_components/cash-entry-cancel-dialog";

type CashEntryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function CashEntryDetailPage(props: CashEntryDetailPageProps) {
  const { id } = use(props.params);

  return (
    <CashEntryFeatureGate>
      <CashEntryDetailProvider id={id} loading={<CashEntryDetailSkeleton />}>
        <div className="flex flex-col gap-y-6">
          <CashEntryDetailHeader />
          <CashEntryDetailInfoCard />
          <CashEntryCancellationStatusCard />
          <CashEntryCancelDialog />
        </div>
      </CashEntryDetailProvider>
    </CashEntryFeatureGate>
  );
}
