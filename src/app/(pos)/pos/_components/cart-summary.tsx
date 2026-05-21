"use client";

import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { usePosCart } from "@/app/(pos)/pos/_providers/pos-provider";
import { usePosUI } from "@/app/(pos)/pos/_providers/pos-provider";

type CartSummaryProps = {
  /** When false, the Bayar CTA and wizard-in-progress banner are hidden.
   *  Used by CartDrawer where the Bayar button lives in PeekStrip instead. */
  showCta?: boolean;
};

export function CartSummary({ showCta = true }: CartSummaryProps) {
  const { items, total, hasCartWarnings, isCheckingOut } = usePosCart();
  const { paymentMethodsState, checkoutStep, startCheckout } = usePosUI();

  const methodsLoading = paymentMethodsState.status === "loading";
  const inWizard = checkoutStep !== null;
  const disabled = items.length === 0 || methodsLoading || hasCartWarnings || isCheckingOut;

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

      {showCta && (
        <>
          {inWizard ? (
            <div className="flex flex-row items-center gap-x-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-400">
              <InformationCircleIcon className="size-4 shrink-0" />
              <span>Sedang membayar — selesaikan di sebelah kiri</span>
            </div>
          ) : (
            <PrimaryButton label="Bayar" disabled={disabled} onClick={startCheckout} />
          )}
        </>
      )}
    </div>
  );
}
