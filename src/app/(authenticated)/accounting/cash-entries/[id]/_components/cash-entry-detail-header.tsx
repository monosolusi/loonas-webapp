"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { ActionMenu } from "@/core/presentations/components/action-menu";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { useCashEntryDetail } from "@/app/(authenticated)/accounting/cash-entries/[id]/_providers/cash-entry-detail-provider";
import { resolveCashEntryStatusChip } from "@/app/(authenticated)/accounting/cash-entries/[id]/_utils/resolve-cash-entry-status-chip";

export function CashEntryDetailHeader() {
  const { entry, openCancelDialog } = useCashEntryDetail();
  const chip = resolveCashEntryStatusChip(entry.status);

  return (
    <DetailPageHeader
      title="Detail Kas"
      subtitle={entry.referenceNumber}
      backHref="/accounting/cash-entries"
      action={
        <div className="flex flex-row items-center gap-x-3">
          <StatusChip label={chip.label} variant={chip.variant} compact />
          {/* AC-6.1/6.2: no edit, no delete — only Batalkan, and only while the entry is active. */}
          {entry.isCurrentlyActive && (
            <ActionMenu options={[{ label: "Batalkan", variant: "danger", onClick: openCancelDialog }]} />
          )}
        </div>
      }
    />
  );
}
