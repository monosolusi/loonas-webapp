"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { usePosCart, usePosUI } from "@/app/(pos)/pos/_providers/pos-provider";

export function PeekStripBayarButton() {
  const { items, hasCartWarnings, isCheckingOut } = usePosCart();
  const { paymentMethodsState, startCheckout } = usePosUI();

  const methodsLoading = paymentMethodsState.status === "loading";
  const disabled = items.length === 0 || methodsLoading || hasCartWarnings || isCheckingOut;

  return <PrimaryButton label="Bayar" disabled={disabled} onClick={startCheckout} />;
}
