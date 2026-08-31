"use client";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type CashCategoriesErrorProps = {
  onRetry: () => void;
};

export function CashCategoriesError({ onRetry }: CashCategoriesErrorProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      <div className="flex flex-col items-center gap-y-3 px-4 py-12 text-center">
        <ExclamationCircleIcon className="size-5 text-error-300" />
        <p className="text-sm text-neutral-400">Gagal memuat data. Periksa koneksi Anda.</p>
        <SecondaryButton outlined onClick={onRetry} className="h-11" label="Coba Lagi" />
      </div>
    </div>
  );
}
