"use client";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { SectionCard } from "@/core/presentations/components/section-card";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type BalanceSummaryErrorProps = {
  onRetry: () => void;
};

export function BalanceSummaryError({ onRetry }: BalanceSummaryErrorProps) {
  return (
    <SectionCard title="Saldo Saat Ini">
      <div className="flex flex-col items-center gap-y-3 py-4">
        <ExclamationCircleIcon className="text-error-300 size-5" />
        <p className="text-sm text-neutral-400">Gagal memuat saldo. Periksa koneksi Anda.</p>
        <SecondaryButton outlined onClick={onRetry} className="h-11" label="Coba Lagi" />
      </div>
    </SectionCard>
  );
}
