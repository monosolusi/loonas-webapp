"use client";

import clsx from "clsx";
import { ChevronUpIcon } from "@heroicons/react/16/solid";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { usePosCart, usePosUI } from "@/app/(pos)/pos/_providers/pos-provider";
import { CartSoftcapChip } from "@/app/(pos)/pos/_components/cart-softcap-chip";
import { CART_SOFTCAP_THRESHOLD } from "@/app/(pos)/pos/_components/cart-softcap";

export function PeekStrip() {
  const { items, total, hasCartWarnings, isCheckingOut } = usePosCart();
  const { paymentMethodsState, checkoutStep, startCheckout, drawerOpen, toggleDrawer } = usePosUI();

  const itemCount = items.length;
  const methodsLoading = paymentMethodsState.status === "loading";
  const inWizard = checkoutStep !== null;
  const disabled = itemCount === 0 || methodsLoading || hasCartWarnings || isCheckingOut;
  const showSoftcap = itemCount >= CART_SOFTCAP_THRESHOLD;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center gap-x-3 border-t border-neutral-200 bg-white px-4 lg:hidden">
      {/* Grabber + item count */}
      <button
        type="button"
        onClick={toggleDrawer}
        aria-label={drawerOpen ? "Tutup keranjang" : "Buka keranjang"}
        className="flex h-11 flex-1 flex-row items-center gap-x-2"
      >
        <ChevronUpIcon
          className={clsx(
            "size-5 shrink-0 text-neutral-400 transition-transform duration-200",
            drawerOpen && "rotate-180",
          )}
        />
        <span className="text-sm font-medium text-neutral-500">
          {itemCount === 0 ? "Keranjang kosong" : `${itemCount} item`}
        </span>
        {itemCount > 0 && (
          <span className="text-sm tabular-nums text-neutral-400">
            · Rp <NumberDisplay value={total} />
          </span>
        )}
        {showSoftcap && (
          <span className="ml-1">
            <CartSoftcapChip />
          </span>
        )}
      </button>

      {/* Right slot — Bayar when idle; status label when wizard is active */}
      {inWizard ? (
        <span className="flex h-11 shrink-0 items-center text-sm text-neutral-600">Sedang membayar</span>
      ) : (
        <PrimaryButton label="Bayar" disabled={disabled} onClick={startCheckout} />
      )}
    </div>
  );
}
