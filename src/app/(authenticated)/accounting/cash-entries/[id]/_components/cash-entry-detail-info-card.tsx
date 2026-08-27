"use client";

import Link from "next/link";
import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useCashEntryDetail } from "@/app/(authenticated)/accounting/cash-entries/[id]/_providers/cash-entry-detail-provider";
import { CashEntryDetailInfoRow } from "@/app/(authenticated)/accounting/cash-entries/[id]/_components/cash-entry-detail-info-row";
import { formatEntryDate, formatTimestamp } from "@/app/(authenticated)/accounting/cash-entries/[id]/_utils/format-cash-entry-date";

export function CashEntryDetailInfoCard() {
  const { entry } = useCashEntryDetail();

  return (
    <SectionCard title="Informasi Kas">
      <div className="flex flex-col gap-y-4">
        <CashEntryDetailInfoRow label="Arah">{entry.isMoneyIn ? "Kas Masuk" : "Kas Keluar"}</CashEntryDetailInfoRow>

        <CashEntryDetailInfoRow label="Jumlah">
          <NumberDisplay value={entry.amount} prefix="Rp" />
        </CashEntryDetailInfoRow>

        <CashEntryDetailInfoRow label="Kategori">{entry.category.name}</CashEntryDetailInfoRow>

        <CashEntryDetailInfoRow label="Tanggal">{formatEntryDate(entry.entryDate)}</CashEntryDetailInfoRow>

        <CashEntryDetailInfoRow label="Catatan">{entry.note ?? "—"}</CashEntryDetailInfoRow>

        <CashEntryDetailInfoRow label="Dicatat oleh">
          <span className="text-xs">{entry.createdByUserId}</span>
        </CashEntryDetailInfoRow>

        <CashEntryDetailInfoRow label="Dicatat pada">{formatTimestamp(entry.createdAt)}</CashEntryDetailInfoRow>

        <CashEntryDetailInfoRow label="Jurnal">
          {entry.journalEntryId ? (
            <Link
              href={`/accounting/journals/${entry.journalEntryId}`}
              className="font-medium text-primary-400 underline"
            >
              Lihat jurnal
            </Link>
          ) : (
            "—"
          )}
        </CashEntryDetailInfoRow>
      </div>
    </SectionCard>
  );
}
