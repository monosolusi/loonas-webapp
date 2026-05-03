"use client";

import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";

export function CartSummary() {
  const { items, total, paymentMethodsState, checkoutStep, startCheckout, hasCartWarnings } = usePos();

  const methodsLoading = paymentMethodsState.status === "loading";
  const inWizard = checkoutStep !== null;
  const disabled = items.length === 0 || methodsLoading || hasCartWarnings;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row items-baseline justify-between">
        <span className="text-sm font-medium text-neutral-400">Total</span>
        <span className="text-base font-semibold tabular-nums text-neutral-500">
          <NumberDisplay value={total} suffix="IDR" />
        </span>
      </div>

      {hasCartWarnings && !inWizard && (
        <span className="text-xs text-warning-300">⚠ Beberapa item melebihi stok — periksa keranjang</span>
      )}

      {inWizard ? (
        <div className="flex flex-row items-center gap-x-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-400">
          <InformationCircleIcon className="size-4 shrink-0" />
          <span>Sedang membayar — selesaikan di sebelah kiri</span>
        </div>
      ) : (
        <PrimaryButton label="Bayar" disabled={disabled} onClick={startCheckout} />
      )}
    </div>
  );
}
