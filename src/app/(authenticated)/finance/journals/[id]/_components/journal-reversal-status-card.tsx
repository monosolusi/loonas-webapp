"use client";

import Link from "next/link";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { useJournalDetail } from "@/app/(authenticated)/finance/journals/[id]/_providers/journal-detail-provider";

export function JournalReversalStatusCard() {
  const { journal } = useJournalDetail();

  if (journal.isReversal && journal.reversedJournalId) {
    return (
      <SectionCard title="Status Pembalikan">
        <div className="flex flex-row items-center gap-x-3">
          <StatusChip label="Jurnal Pembalik" variant="primary" compact />
          <span className="text-sm text-neutral-500">Jurnal ini adalah pembalik dari jurnal lain.</span>
          <Link
            href={`/finance/journals/${journal.reversedJournalId}`}
            className="ml-auto shrink-0 text-sm font-medium text-primary-300 hover:underline"
          >
            Lihat jurnal asal
          </Link>
        </div>
      </SectionCard>
    );
  }

  if (journal.isReversedCurrently && journal.supersededById) {
    return (
      <SectionCard title="Status Pembalikan">
        <div className="flex flex-row items-center gap-x-3">
          <StatusChip label="Sudah Dibalik" variant="warning" compact />
          <span className="text-sm text-neutral-500">Jurnal ini telah dibalik.</span>
          <Link
            href={`/finance/journals/${journal.supersededById}`}
            className="ml-auto shrink-0 text-sm font-medium text-primary-300 hover:underline"
          >
            Lihat jurnal pembalik
          </Link>
        </div>
      </SectionCard>
    );
  }

  return null;
}
