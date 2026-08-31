"use client";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type CategoriesFetchErrorProps = {
  onRetry: () => void;
};

/** In-card error strip for a failed category-list fetch — the field is unusable, so the
 *  strip replaces the select rather than hiding beside it. */
export function CategoriesFetchError({ onRetry }: CategoriesFetchErrorProps) {
  return (
    <div className="flex flex-col items-center gap-y-3 py-4">
      <ExclamationCircleIcon className="text-error-300 size-5" />
      <p className="text-sm text-neutral-400">Gagal memuat kategori kas. Periksa koneksi Anda.</p>
      <SecondaryButton outlined onClick={onRetry} className="h-11" label="Coba Lagi" />
    </div>
  );
}
