"use client";

import { useEffect, useRef } from "react";
import { CheckCircleIcon, LockClosedIcon, ClockIcon } from "@heroicons/react/24/outline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useOpeningBalanceWizard } from "@/app/(authenticated)/finance/opening-balance/_providers/opening-balance-wizard-provider";

export function WizardIntroStep() {
  const { goToStep, step } = useOpeningBalanceWizard();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step === "intro") {
      headingRef.current?.focus();
    }
  }, [step]);

  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-right text-xs text-neutral-300">Langkah 1 dari 3</p>
      <SectionCard title="">
        <div className="px-0">
          <h1
            ref={headingRef}
            role="heading"
            aria-level={1}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight text-neutral-400 outline-none"
          >
            Atur saldo awal usaha Anda
          </h1>
          <p className="mt-3 max-w-prose text-sm text-neutral-300">
            Saldo awal adalah snapshot kondisi keuangan usaha Anda pada satu tanggal tertentu — berapa
            uang yang ada, berapa utang, dan berapa modal yang sudah ditanamkan. Setelah diisi, Loonas
            bisa langsung menghasilkan laporan keuangan yang akurat.
          </p>

          <div className="my-6 border-t border-neutral-100" />

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-success-400" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-neutral-400">Setup sekali, selamanya</p>
                <p className="text-sm text-neutral-300">
                  Anda hanya perlu mengisi ini satu kali. Transaksi berikutnya dicatat otomatis.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <LockClosedIcon className="mt-0.5 size-5 shrink-0 text-primary-300" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-neutral-400">Tidak bisa diubah setelah disimpan</p>
                <p className="text-sm text-neutral-300">
                  Pastikan angka yang Anda masukkan sudah benar sebelum menyimpan. Jika ada kekeliruan,
                  hubungi tim Loonas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ClockIcon className="mt-0.5 size-5 shrink-0 text-neutral-300" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-neutral-400">Perlu waktu sekitar 5 menit</p>
                <p className="text-sm text-neutral-300">
                  Siapkan catatan saldo rekening, stok, dan utang usaha Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-neutral-100 pt-6">
            <PrimaryButton
              label="Mulai"
              onClick={() => goToStep("date")}
              className="w-auto px-8"
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
