"use client";

import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { useFixedCostEntries } from "@/app/(authenticated)/finance/fixed-costs/_providers/fixed-cost-entries-provider";

export function FixedCostEntryTable() {
  const { entries, total, loading, hasNoMaster, setAmount, isClosed } = useFixedCostEntries();

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="grid grid-cols-[1fr_1fr] gap-3 border-b border-neutral-100 bg-neutral-50 px-6 py-3 sm:grid-cols-[3fr_1.5fr] sm:gap-0">
        <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Nama Biaya</span>
        <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">
          Jumlah (per bulan)
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 px-6 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-11 animate-pulse rounded-lg bg-neutral-100" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-neutral-300">
          {hasNoMaster ? (
            <>
              Belum ada biaya tetap. Tambahkan jenis biaya di{" "}
              <a href="/settings/fixed-costs" className="font-medium text-primary-300 hover:text-primary-300/80">
                Pengaturan
              </a>
              .
            </>
          ) : (
            "Tidak ada data untuk bulan ini."
          )}
        </div>
      ) : (
        entries.map((entry) => (
          <div
            key={entry.fixedCostId}
            className="grid grid-cols-[1fr_1fr] items-center gap-3 border-b border-neutral-100 px-6 py-3 last:border-b-0 sm:grid-cols-[3fr_1.5fr] sm:gap-0"
          >
            <span className="text-sm font-medium text-neutral-500">{entry.fixedCostName}</span>
            <CurrencyInput
              label=""
              leftIcon={<span className="text-sm text-neutral-300">Rp</span>}
              placeholder="0"
              value={entry.amount}
              onChange={(val) => setAmount(entry.fixedCostId, val)}
              required={false}
              disabled={isClosed}
              aria-disabled={isClosed}
              aria-describedby={isClosed ? "closed-period-note" : undefined}
            />
          </div>
        ))
      )}

      {entries.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr] items-center gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 sm:grid-cols-[3fr_1.5fr] sm:gap-0">
          <span className="text-sm font-semibold text-neutral-500">Total</span>
          <span className="text-sm font-semibold text-neutral-500">{IDRFormatter.toCurrency(total)}</span>
        </div>
      )}
    </div>
  );
}
