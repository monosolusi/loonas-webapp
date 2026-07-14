"use client";

import Image from "next/image";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";
import { getPaymentMethodIconSrc } from "@/app/(pos)/pos/_components/payment-method-icon";

export function CheckoutSelectedMethodStrip() {
  const { currentMethod, checkoutStep, selectableMethodCount, changePaymentMethod } = usePos();

  if (!currentMethod) return null;
  if (checkoutStep === "method" || checkoutStep === null) return null;

  const gateway = currentMethod.paymentGateway;
  const canChange = selectableMethodCount > 1;

  return (
    <div className="px-4 pt-4 sm:px-6">
      <div className="flex h-20 w-full flex-row items-center gap-x-4 rounded-lg border border-neutral-200 p-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-neutral-50">
          <Image src={getPaymentMethodIconSrc(gateway.type)} alt="" width={24} height={24} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-y-0.5">
          <span className="truncate text-sm font-semibold text-neutral-500">{gateway.title}</span>
          <span className="truncate text-xs text-neutral-400">{gateway.description || "—"}</span>
        </div>
        {canChange && (
          <button
            type="button"
            onClick={changePaymentMethod}
            className="shrink-0 text-sm font-medium whitespace-nowrap text-primary-300 transition-colors hover:text-primary-400"
          >
            Ganti metode
          </button>
        )}
      </div>
    </div>
  );
}
