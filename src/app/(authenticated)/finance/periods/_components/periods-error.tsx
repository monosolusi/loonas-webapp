"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

export function PeriodsError() {
  const handleRetry = () => {
    revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS);
  };

  return (
    <SectionCard title="Periode Akuntansi">
      <div className="flex flex-col items-center justify-center gap-y-3 py-12">
        <span className="text-sm text-neutral-400">Gagal memuat daftar periode akuntansi.</span>
        <button
          type="button"
          onClick={handleRetry}
          className="text-sm text-primary-300 hover:underline"
        >
          Coba lagi
        </button>
      </div>
    </SectionCard>
  );
}
