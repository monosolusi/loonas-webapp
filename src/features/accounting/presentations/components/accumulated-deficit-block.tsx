"use client";

import { useEffect, useRef } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { LOONAS_WHATSAPP_URL } from "@/core/utilities/contact";

type AccumulatedDeficitBlockProps = {
  /**
   * Optional callback invoked once on mount. The future wizard host (LNS-379) can
   * use this to signal that the submit button should be disabled when this block renders.
   */
  onDeadEnd?: () => void;
};

export function AccumulatedDeficitBlock({ onDeadEnd }: AccumulatedDeficitBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const didFocus = useRef(false);
  // Stable ref so the mount-effect closure captures the latest callback without re-running.
  const onDeadEndRef = useRef(onDeadEnd);
  onDeadEndRef.current = onDeadEnd;

  useEffect(() => {
    if (!didFocus.current) {
      didFocus.current = true;
      containerRef.current?.focus();
    }
    onDeadEndRef.current?.();
    // Empty deps array: both side-effects run exactly once on mount.
  }, []);

  function handleWhatsApp() {
    if (LOONAS_WHATSAPP_URL) {
      window.open(LOONAS_WHATSAPP_URL, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div
      ref={containerRef}
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
      className="rounded-lg border border-error-100 bg-error-50 p-4"
    >
      <div className="flex gap-3">
        <ExclamationCircleIcon className="mt-0.5 size-5 shrink-0 text-error-400" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-error-500">Saldo akumulasi rugi belum didukung di versi ini</p>
          <p className="mt-1 text-sm text-neutral-500">
            Tim Loonas mendeteksi bahwa ekuitas usaha Anda saat ini berada di posisi defisit (sisi debit). Kondisi ini
            belum dapat diproses secara otomatis pada versi saat ini. Hubungi tim Loonas agar dapat membantu melanjutkan
            migrasi saldo awal Anda.
          </p>
          <button
            type="button"
            aria-label="Hubungi tim Loonas melalui WhatsApp"
            disabled={!LOONAS_WHATSAPP_URL}
            onClick={handleWhatsApp}
            className="mt-3 text-sm text-error-500 underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hubungi Loonas via WhatsApp →
          </button>
        </div>
      </div>
    </div>
  );
}
