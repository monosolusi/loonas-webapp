"use client";

import { ClockIcon } from "@heroicons/react/24/solid";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

type QrisExpiredPanelProps = {
  onRegenerate: () => void;
  isRegenerating: boolean;
};

export function QrisExpiredPanel({ onRegenerate, isRegenerating }: QrisExpiredPanelProps) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-y-4 px-6 py-10 text-center"
      aria-live="polite"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-warning-100 text-warning-500">
        <ClockIcon className="size-8" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-500">QR sudah kedaluwarsa</h3>
      <p className="text-sm text-neutral-300">Buat kode QR baru untuk melanjutkan pembayaran.</p>
      <span className="sr-only">QR sudah kedaluwarsa. Silakan buat kode QR baru.</span>
      <PrimaryButton
        label="Buat QR baru"
        onClick={onRegenerate}
        loading={isRegenerating}
        className="max-w-xs"
      />
    </div>
  );
}
