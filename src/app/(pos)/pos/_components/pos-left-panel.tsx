"use client";

import { CheckoutPanel } from "@/app/(pos)/pos/_components/checkout-panel";
import { ProductPicker } from "@/app/(pos)/pos/_components/product-picker";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";

export function PosLeftPanel() {
  const { checkoutStep } = usePos();
  if (checkoutStep === null) return <ProductPicker />;
  return <CheckoutPanel />;
}
