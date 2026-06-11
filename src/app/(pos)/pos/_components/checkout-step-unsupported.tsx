"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";

export function CheckoutStepUnsupported() {
  const { goBack } = usePos();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-3 p-6 text-center">
      <ExclamationTriangleIcon className="size-10 text-warning-300" />
      <span className="text-base font-semibold text-neutral-500">Metode pembayaran belum didukung</span>
      <span className="text-sm text-neutral-300">Pilih metode lain dari daftar.</span>
      <SecondaryButton outlined label="Pilih metode lain" className="w-auto px-4" onClick={goBack} />
    </div>
  );
}
