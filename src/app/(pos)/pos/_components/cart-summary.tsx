"use client";

import { NumberDisplay } from "@/core/presentations/components/number-display";
import { usePosCart, usePosUI } from "@/app/(pos)/pos/_providers/pos-provider";
import { CartSummaryBayarButton } from "@/app/(pos)/pos/_components/cart-summary-bayar-button";
import { CartSummaryInWizardBanner } from "@/app/(pos)/pos/_components/cart-summary-in-wizard-banner";

type CartSummaryProps = {
  /** When false, the Bayar CTA and wizard-in-progress banner are hidden.
   *  Used by CartDrawer where the Bayar button lives in PeekStrip instead. */
  showCta?: boolean;
};

export function CartSummary({ showCta = true }: CartSummaryProps) {
  const { total, hasCartWarnings } = usePosCart();
  const { checkoutStep } = usePosUI();

  const inWizard = checkoutStep !== null;

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

      {showCta && (inWizard ? <CartSummaryInWizardBanner /> : <CartSummaryBayarButton />)}
    </div>
  );
}
