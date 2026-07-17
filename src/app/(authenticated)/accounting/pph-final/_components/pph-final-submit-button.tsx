"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { usePphFinal } from "@/app/(authenticated)/accounting/pph-final/_providers/pph-final-provider";

export function PphFinalSubmitButton() {
  const { isSubmitting, enabled, handleSubmit } = usePphFinal();

  return (
    <PrimaryButton
      label={isSubmitting ? "Menyimpan…" : "Catat Pembayaran"}
      loadingLabel="Menyimpan…"
      loading={isSubmitting}
      disabled={!enabled}
      aria-busy={isSubmitting}
      aria-disabled={!enabled}
      onClick={handleSubmit}
    />
  );
}
