"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { CheckoutStep } from "@/app/(pos)/pos/_providers/pos-provider.types";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";

const STEP_LABELS: Record<CheckoutStep, string> = {
  method: "Pilih metode",
  nominal: "Nominal",
  confirm: "Selesai",
};

export function CheckoutHeader() {
  const { checkoutStep, currentMethod, currentHandler, cancelCheckout, goBack, pickerAutoSkipped } = usePos();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const stepIndex = currentHandler && checkoutStep ? currentHandler.steps.indexOf(checkoutStep) : -1;
  // When the picker was auto-skipped, treat the first non-method step as the
  // wizard's effective first step — hide back to avoid stranding the cashier
  // on a single-option picker.
  const showBack = stepIndex > (pickerAutoSkipped ? 1 : 0);

  const stepLabel = checkoutStep ? STEP_LABELS[checkoutStep] : STEP_LABELS.method;
  const methodTitle = currentMethod?.paymentGateway.title ?? null;
  const cancelGuard = currentHandler?.cancelGuard ?? null;

  const onCancelClick = () => {
    if (cancelGuard) setConfirmingCancel(true);
    else cancelCheckout();
  };

  const onConfirmCancel = () => {
    setConfirmingCancel(false);
    cancelCheckout();
  };

  return (
    <>
      <div className="flex h-14 flex-row items-center gap-x-2 border-b border-b-neutral-100 px-3 sm:px-4">
        {showBack && (
          <>
            <button
              type="button"
              onClick={goBack}
              className="flex h-9 shrink-0 flex-row items-center gap-x-1 rounded-md px-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-50"
            >
              <ChevronLeftIcon className="size-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
            <span className="shrink-0 text-neutral-200">·</span>
          </>
        )}

        {/* "Pembayaran" + method name are redundant with page context on mobile (the selected-method
            strip below already shows the method in full) — dropped below sm to make room for stepLabel. */}
        <span className="hidden shrink-0 text-sm leading-5 font-semibold tracking-wide text-neutral-500 uppercase sm:inline">
          Pembayaran
        </span>

        {methodTitle && (
          <>
            <span className="hidden text-neutral-200 sm:inline">·</span>
            <span className="hidden min-w-0 truncate text-sm leading-5 font-medium text-neutral-500 sm:inline">
              {methodTitle}
            </span>
          </>
        )}

        <span className={clsx("shrink-0 text-neutral-200", !showBack && "hidden sm:inline")}>·</span>
        <span className="text-sm leading-5 font-medium text-neutral-500 sm:font-normal sm:text-neutral-400">
          {stepLabel}
        </span>

        <button
          type="button"
          onClick={onCancelClick}
          aria-label="Batalkan pembayaran"
          className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-50"
        >
          <XMarkIcon className="size-5" />
        </button>
      </div>

      {cancelGuard && (
        <ConfirmationDialog
          open={confirmingCancel}
          onClose={() => setConfirmingCancel(false)}
          title={cancelGuard.title}
          description={cancelGuard.description}
          confirmLabel={cancelGuard.confirmLabel}
          onConfirm={onConfirmCancel}
        />
      )}
    </>
  );
}
