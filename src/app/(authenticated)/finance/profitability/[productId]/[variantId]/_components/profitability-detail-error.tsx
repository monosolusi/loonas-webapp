"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type ProfitabilityDetailErrorProps = {
  onRetry: () => void;
};

export function ProfitabilityDetailError({ onRetry }: ProfitabilityDetailErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 py-16">
      <ExclamationTriangleIcon className="size-10 text-neutral-300" />
      <p className="text-sm text-neutral-400">Gagal memuat data profitabilitas</p>
      <SecondaryButton type="button" label="Coba Lagi" onClick={onRetry} className="w-auto px-4" />
    </div>
  );
}
