"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useFixedCostEntries } from "@/app/(authenticated)/accounting/fixed-costs/_providers/fixed-cost-entries-provider";

export function FixedCostClosedNote() {
  const { matchedPeriod, isClosed, isLocked } = useFixedCostEntries();

  if (!isClosed || !matchedPeriod) return null;

  return (
    <div
      id="closed-period-note"
      role="status"
      aria-live="polite"
      className="flex items-start gap-x-3 rounded-lg border border-warning-400 bg-warning-50 px-4 py-3"
    >
      <InformationCircleIcon className="mt-0.5 size-4 shrink-0 text-warning-400" />
      <p className="text-sm text-warning-500">
        {isLocked ? (
          <>
            Periode <span className="font-semibold">{matchedPeriod.label}</span> sudah dikunci oleh penutupan tahun
            buku. Data biaya tetap tidak dapat diubah.
          </>
        ) : (
          <>
            Periode <span className="font-semibold">{matchedPeriod.label}</span> sudah ditutup. Data biaya tetap tidak
            dapat diubah.
          </>
        )}
      </p>
    </div>
  );
}
