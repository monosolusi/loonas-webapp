"use client";

import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type CashEntrySettingsErrorProps = {
  onRetry?: () => void;
};

// The GET is a synthetic record that never 404s, so unlike the cash-entry detail error there is
// no NOT_FOUND branch — but its contract also declares 403, which cannot succeed on retry. The
// provider passes `onRetry` only for retryable failures (classifyFetchError); this link stays as
// the escape in both cases.
export function CashEntrySettingsError({ onRetry }: CashEntrySettingsErrorProps) {
  return (
    <div className="flex flex-col items-center gap-y-4 p-12 text-center">
      <ExclamationCircleIcon className="size-10 text-neutral-200" />
      <p className="text-sm text-neutral-400">Pengaturan kas gagal dimuat.</p>
      <div className="flex flex-row items-center gap-x-3">
        {onRetry && (
          <SecondaryButton outlined type="button" label="Coba lagi" onClick={onRetry} className="w-auto px-4" />
        )}
        <Link href="/accounting/cash-entries" className="text-primary-400 text-sm font-medium underline">
          Kembali ke Kas
        </Link>
      </div>
    </div>
  );
}
