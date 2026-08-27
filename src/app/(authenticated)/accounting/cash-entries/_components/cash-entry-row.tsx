"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ActionMenu } from "@/core/presentations/components/action-menu";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { resolveCashEntryDirection } from "@/app/(authenticated)/accounting/cash-entries/_utils/resolve-cash-entry-direction";
import { resolveCashEntryStatusChip } from "@/app/(authenticated)/accounting/cash-entries/_utils/resolve-cash-entry-status-chip";
import { resolveCashEntryCrossReference } from "@/app/(authenticated)/accounting/cash-entries/_utils/resolve-cash-entry-cross-reference";
import { formatEntryDate } from "@/app/(authenticated)/accounting/cash-entries/_utils/format-cash-entry-date";

type CashEntryRowProps = { entry: CashEntryEntity };

export function CashEntryRow({ entry }: CashEntryRowProps) {
  const router = useRouter();

  const direction = resolveCashEntryDirection(entry);
  const statusChip = resolveCashEntryStatusChip(entry.status);
  const crossReference = resolveCashEntryCrossReference(entry);
  const dateLabel = formatEntryDate(entry.entryDate);
  const detailHref = `/accounting/cash-entries/${entry.id}`;

  return (
    <>
      {/* Desktop: grid row (lg and up). No whole-row navigation — matches journal-row.tsx /
          period-row.tsx: a plain grid row with the single "Lihat detail" action in ActionMenu. */}
      <div className="hidden grid-cols-[1fr_0.8fr_1fr_0.9fr_1fr_1.1fr_56px] items-center gap-x-2 border-b border-neutral-100 px-6 py-4 last:border-b-0 lg:grid">
        <span className="truncate text-sm font-medium text-neutral-500">{entry.referenceNumber}</span>
        <span className="text-sm text-neutral-400">{direction.label}</span>
        <span className="truncate text-sm text-neutral-400">{entry.category.name}</span>
        <span className="text-sm text-neutral-400">{dateLabel}</span>
        <span className="text-right text-sm font-medium text-neutral-500">
          <NumberDisplay value={entry.amount} prefix="Rp" />
        </span>
        <div className="flex flex-col items-start gap-y-1">
          <StatusChip label={statusChip.label} variant={statusChip.variant} compact />
          {crossReference.kind !== "none" && crossReference.targetId && (
            <Link
              href={`/accounting/cash-entries/${crossReference.targetId}`}
              className="text-xs font-medium text-primary-400 underline"
            >
              {crossReference.linkLabel}
            </Link>
          )}
        </div>
        <div className="flex justify-end">
          <ActionMenu options={[{ label: "Lihat detail", onClick: () => router.push(detailHref) }]} />
        </div>
      </div>

      {/* Mobile: stacked card (below lg). Taps navigate directly to the detail page. */}
      <div className="lg:hidden">
        <MobileListCard
          href={detailHref}
          title={entry.referenceNumber}
          subtitle={`${direction.label} · ${entry.category.name}`}
          meta={dateLabel}
          trailingTop={<NumberDisplay value={entry.amount} prefix="Rp" />}
          trailingBottom={<StatusChip label={statusChip.label} variant={statusChip.variant} compact />}
        />
      </div>
    </>
  );
}
