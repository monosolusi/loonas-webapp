"use client";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { SectionCard } from "@/core/presentations/components/section-card";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type CogsBlockErrorProps = {
  onRetry: () => void;
};

export function CogsBlockError({ onRetry }: CogsBlockErrorProps) {
  return (
    <SectionCard title="HPP">
      <div className="flex flex-col items-center gap-y-3 py-4">
        <ExclamationCircleIcon className="size-5 text-error-300" />
        <p className="text-sm text-neutral-400">Gagal memuat HPP. Periksa koneksi Anda.</p>
        <SecondaryButton outlined onClick={onRetry} className="h-11" label="Coba Lagi" />
      </div>
    </SectionCard>
  );
}
