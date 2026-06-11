"use client";

import { CheckIcon } from "@heroicons/react/24/solid";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { QRIS_COPY } from "@/app/(pos)/pos/_payment-methods/qris/_copy";

type QrisPaidSplashProps = {
  total: number;
};

export function QrisPaidSplash({ total }: QrisPaidSplashProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-4 px-6 py-10" aria-live="polite">
      <div className="flex size-16 items-center justify-center rounded-full bg-success-100 text-success-500">
        <CheckIcon className="size-8" aria-hidden />
      </div>
      <div className="text-lg font-semibold text-neutral-500">{QRIS_COPY.PAID_HEADING}</div>
      <div className="tabular-nums text-2xl font-semibold text-neutral-500">
        <NumberDisplay value={total} suffix="IDR" />
      </div>
      <div className="text-sm text-neutral-300">{QRIS_COPY.PAID_SUPPORT}</div>
    </div>
  );
}
