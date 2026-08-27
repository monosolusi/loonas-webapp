"use client";

import Link from "next/link";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { useCashEntryDetail } from "@/app/(authenticated)/accounting/cash-entries/[id]/_providers/cash-entry-detail-provider";
import { resolveCashEntryCrossReference } from "@/app/(authenticated)/accounting/cash-entries/_utils/resolve-cash-entry-cross-reference";

export function CashEntryCancellationStatusCard() {
  const { entry } = useCashEntryDetail();
  const crossReference = resolveCashEntryCrossReference(entry);

  if (crossReference.kind === "none") return null;

  return (
    <SectionCard title="Status Pembatalan">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-3">
        <StatusChip label={crossReference.chip.label} variant={crossReference.chip.variant} compact />
        <span className="text-sm text-neutral-500">{crossReference.copy}</span>
        {/* The status flag alone selects the branch above; a missing target id yields a chip
            without a link here, never a silently absent card. */}
        {crossReference.targetId && (
          <Link
            href={`/accounting/cash-entries/${crossReference.targetId}`}
            className="text-sm font-medium text-primary-400 underline sm:ml-auto sm:shrink-0"
          >
            {crossReference.linkLabel}
          </Link>
        )}
      </div>
    </SectionCard>
  );
}
