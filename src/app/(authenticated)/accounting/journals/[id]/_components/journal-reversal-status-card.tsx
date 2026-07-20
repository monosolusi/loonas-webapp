"use client";

import Link from "next/link";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { useJournalDetail } from "@/app/(authenticated)/accounting/journals/[id]/_providers/journal-detail-provider";

export function JournalReversalStatusCard() {
  const { journal } = useJournalDetail();

  if (journal.isReversal && journal.reversedJournalId) {
    return (
      <SectionCard title="Status Pembalikan">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-3">
          <StatusChip label="Jurnal Pembalik" variant="primary" compact />
          <span className="text-sm text-neutral-500">Jurnal ini adalah pembalik dari jurnal lain.</span>
          <Link
            href={`/accounting/journals/${journal.reversedJournalId}`}
            className="text-sm font-medium text-primary-300 hover:underline sm:ml-auto sm:shrink-0"
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-3">
          <StatusChip label="Sudah Dibalik" variant="warning" compact />
          <span className="text-sm text-neutral-500">Jurnal ini telah dibalik.</span>
          <Link
            href={`/accounting/journals/${journal.supersededById}`}
            className="text-sm font-medium text-primary-300 hover:underline sm:ml-auto sm:shrink-0"
          >
            Lihat jurnal pembalik
          </Link>
        </div>
      </SectionCard>
    );
  }

  return null;
}
