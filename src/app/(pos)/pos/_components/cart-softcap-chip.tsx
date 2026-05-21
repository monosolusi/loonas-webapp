"use client";

import { StatusChip } from "@/core/presentations/components/status-chip";
import { CART_SOFTCAP_WARNING } from "@/app/(pos)/pos/_components/cart-softcap";

export function CartSoftcapChip() {
  return <StatusChip label={CART_SOFTCAP_WARNING} variant="warning" compact />;
}
