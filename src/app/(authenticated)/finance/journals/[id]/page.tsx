"use client";

import { use } from "react";
import { JournalDetailProvider } from "@/app/(authenticated)/finance/journals/[id]/_providers/journal-detail-provider";
import { JournalDetailSkeleton } from "@/app/(authenticated)/finance/journals/[id]/_components/journal-detail-skeleton";
import { JournalDetailHeader } from "@/app/(authenticated)/finance/journals/[id]/_components/journal-detail-header";
import { JournalDetailInfoCard } from "@/app/(authenticated)/finance/journals/[id]/_components/journal-detail-info-card";
import { JournalDetailLinesCard } from "@/app/(authenticated)/finance/journals/[id]/_components/journal-detail-lines-card";
import { JournalReversalStatusCard } from "@/app/(authenticated)/finance/journals/[id]/_components/journal-reversal-status-card";
import { JournalReverseDialog } from "@/app/(authenticated)/finance/journals/[id]/_components/journal-reverse-dialog";

type JournalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function JournalDetailPage(props: JournalDetailPageProps) {
  const { id } = use(props.params);

  return (
    <JournalDetailProvider id={id} loading={<JournalDetailSkeleton />}>
      <div className="flex flex-col gap-y-6">
        <JournalDetailHeader />
        <JournalDetailInfoCard />
        <JournalDetailLinesCard />
        <JournalReversalStatusCard />
        <JournalReverseDialog />
      </div>
    </JournalDetailProvider>
  );
}
