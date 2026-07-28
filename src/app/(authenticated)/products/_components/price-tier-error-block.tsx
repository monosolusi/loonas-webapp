"use client";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { OffendingVariant } from "@/features/product/presentations/helpers/price-tier-error";

type PriceTierErrorBlockProps = {
  message: string;
  offendingVariants: OffendingVariant[];
};

export function PriceTierErrorBlock({ message, offendingVariants }: PriceTierErrorBlockProps) {
  return (
    <div className="border-error-300/20 bg-error-300/5 flex flex-col gap-y-2 rounded-lg border px-4 py-3" role="alert">
      <div className="flex flex-row items-start gap-x-2">
        <ExclamationCircleIcon className="text-error-300 mt-0.5 size-5 shrink-0" />
        <p className="text-error-300 text-sm">{message}</p>
      </div>

      {/* Every offending variant, never just the first. */}
      {offendingVariants.length > 0 && (
        <ul className="flex flex-col gap-y-1 pl-7">
          {offendingVariants.map((variant) => (
            <li key={variant.id} className="text-error-300 flex flex-row items-baseline justify-between gap-x-3 text-sm">
              <span className="min-w-0 truncate">{variant.name || "Varian tanpa nama"}</span>
              <span className="shrink-0 tabular-nums">
                <CurrencyDisplay value={variant.price} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
