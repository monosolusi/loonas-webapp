"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { useJournalDetail } from "@/app/(authenticated)/finance/journals/[id]/_providers/journal-detail-provider";
import { JournalDetailInfoRow } from "@/app/(authenticated)/finance/journals/[id]/_components/journal-detail-info-row";

export function JournalDetailInfoCard() {
  const { journal } = useJournalDetail();

  const createdAtDisplay = useMemo(
    () => DateTime.fromISO(journal.createdAt).setLocale("id").toFormat("dd MMM yyyy, HH:mm"),
    [journal.createdAt],
  );

  return (
    <SectionCard title="Informasi Jurnal">
      <div className="flex flex-col gap-y-4">
        <JournalDetailInfoRow label="Tanggal">{journal.displayDate}</JournalDetailInfoRow>

        <JournalDetailInfoRow label="Memo">{journal.memo ?? "—"}</JournalDetailInfoRow>

        <JournalDetailInfoRow label="Diposting oleh">
          {journal.postedBy?.kind === "system" ? (
            <StatusChip label="Sistem" variant="neutral" compact />
          ) : (
            (journal.postedBy?.label ?? "Sistem")
          )}
        </JournalDetailInfoRow>

        <JournalDetailInfoRow label="Dibuat pada">{createdAtDisplay}</JournalDetailInfoRow>

        {(journal.referenceType || journal.referenceId) && (
          <JournalDetailInfoRow label="Referensi">
            {[journal.referenceType, journal.referenceId].filter(Boolean).join(" / ")}
          </JournalDetailInfoRow>
        )}
      </div>
    </SectionCard>
  );
}
