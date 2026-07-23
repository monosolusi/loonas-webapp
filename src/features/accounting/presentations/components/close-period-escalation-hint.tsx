"use client";

import { LOONAS_WHATSAPP_URL } from "@/core/utilities/contact";

export function ClosePeriodEscalationHint() {
  function handleWhatsApp() {
    if (LOONAS_WHATSAPP_URL) {
      window.open(LOONAS_WHATSAPP_URL, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="mt-2">
      <p className="text-sm text-warning-500">Masih gagal? Tim Loonas siap membantu.</p>
      <button
        type="button"
        aria-label="Hubungi tim Loonas melalui WhatsApp"
        disabled={!LOONAS_WHATSAPP_URL}
        onClick={handleWhatsApp}
        className="mt-1 text-sm text-warning-500 underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Hubungi Loonas via WhatsApp →
      </button>
    </div>
  );
}
