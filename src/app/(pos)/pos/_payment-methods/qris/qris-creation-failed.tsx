"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type QrisCreationFailedProps = {
  onRetry: () => void;
  onChangeMethod: () => void;
};

export function QrisCreationFailed({ onRetry, onChangeMethod }: QrisCreationFailedProps) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-y-4 px-6 py-10 text-center"
      aria-live="polite"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-error-100 text-error-500">
        <ExclamationTriangleIcon className="size-8" aria-hidden />
      </div>
      <div className="text-lg font-semibold text-neutral-500">Gagal membuat kode QR</div>
      <div className="text-sm text-neutral-300">Silakan coba lagi atau pilih metode pembayaran lain.</div>
      <div className="flex w-full max-w-xs flex-col gap-y-2 pt-2">
        <PrimaryButton label="Coba lagi" onClick={onRetry} />
        <SecondaryButton outlined label="Ganti metode" onClick={onChangeMethod} />
      </div>
    </div>
  );
}
